import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Reservation, ReservationType, ReservationStatus } from './entities/reservation.entity';
import { Stock } from '../products/entities/stock.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { HistoryService } from '../history/history.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class ReservationsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
    @InjectRepository(Stock)
    private stockRepo: Repository<Stock>,
    @InjectRepository(Warehouse)
    private warehouseRepo: Repository<Warehouse>,
    private historyService: HistoryService,
    private amqpConnection: AmqpConnection,
  ) {}

  async reserveOrder(
    orderId: string,
    items: { sku: string; quantity: number }[],
    region: string,
    partialAllowed = false,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reservations: Array<{ sku: string; quantity: number; warehouseId: number }> = [];
      for (const item of items) {
        const { sku, quantity } = item;
        // find stocks in region ordered by priority
        const stocks = await queryRunner.manager
          .getRepository(Stock)
          .createQueryBuilder('stock')
          .leftJoinAndSelect('stock.warehouse', 'warehouse')
          .where('stock.sku = :sku', { sku })
          .andWhere('warehouse.region = :region', { region })
          .orderBy('warehouse.priority', 'ASC')
          .getMany();
        if (!stocks.length) {
          throw new NotFoundException(`SKU ${sku} not found in region ${region}`);
        }
        let remaining = quantity;
        const availableTotal = stocks.reduce((sum, s) => sum + (s.total - s.reserved), 0);
        if (availableTotal < quantity && !partialAllowed) {
          throw new BadRequestException(`Insufficient stock for SKU ${sku} in region ${region}`);
        }
        for (const stock of stocks) {
          if (remaining <= 0) break;
          const available = stock.total - stock.reserved;
          if (available <= 0) continue;
          const toReserve = partialAllowed ? Math.min(available, remaining) : Math.min(available, remaining);
          if (toReserve <= 0) continue;
          // update stock reserve count
          stock.reserved += toReserve;
          await queryRunner.manager.getRepository(Stock).save(stock);
          // create reservation record
          const reservation = queryRunner.manager.getRepository(Reservation).create({
            orderId,
            sku,
            warehouse: stock.warehouse,
            quantity: toReserve,
            type: 'order' as ReservationType,
            status: 'active' as ReservationStatus,
          });
          await queryRunner.manager.getRepository(Reservation).save(reservation);
          // log history
          await this.historyService.logOperation({
            sku,
            warehouseId: stock.warehouse.id,
            type: 'reserve',
            quantityChange: -toReserve,
            initiator: `Order(${orderId})`,
            orderId,
          });
          reservations.push({ sku, quantity: toReserve, warehouseId: stock.warehouse.id });
          remaining -= toReserve;
        }
      }
      await queryRunner.commitTransaction();
      // publish event
      this.amqpConnection.publish('inventory', 'inventory.stock_reserved', { orderId, reservations });
      return { orderId, status: partialAllowed ? 'partial' : 'reserved', reservations };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async releaseOrder(orderId: string) {
    const reservations = await this.reservationRepo.find({ where: { orderId, status: 'active' }, relations: ['warehouse'] });
    if (!reservations.length) {
      throw new NotFoundException(`No active reservations for order ${orderId}`);
    }
    for (const res of reservations) {
      // update stock
      const stock = await this.stockRepo.findOne({ where: { sku: res.sku, warehouse: { id: res.warehouse.id } } });
      if (stock) {
        stock.reserved -= res.quantity;
        await this.stockRepo.save(stock);
      }
      // mark reservation cancelled
      res.status = 'cancelled';
      await this.reservationRepo.save(res);
      // log history
      await this.historyService.logOperation({
        sku: res.sku,
        warehouseId: res.warehouse.id,
        type: 'release',
        quantityChange: res.quantity,
        initiator: `Order(${orderId})`,
        orderId,
      });
    }
    // publish event
    this.amqpConnection.publish('inventory', 'inventory.stock_released', { orderId });
    return { orderId, status: 'released' };
  }

  async manualReserve(
    sku: string,
    quantity: number,
    warehouseId: number,
    comment?: string,
  ) {
    const stock = await this.stockRepo.findOne({ where: { sku, warehouse: { id: warehouseId } }, relations: ['warehouse'] });
    if (!stock) {
      throw new NotFoundException(`Stock not found for SKU ${sku} at warehouse ${warehouseId}`);
    }
    const available = stock.total - stock.reserved;
    if (quantity > available) {
      throw new BadRequestException(`Insufficient stock, available ${available}`);
    }
    stock.reserved += quantity;
    await this.stockRepo.save(stock);
    const reservation = this.reservationRepo.create({
      sku,
      warehouse: stock.warehouse,
      quantity,
      type: 'manual' as ReservationType,
      status: 'active' as ReservationStatus,
      comment,
    });
    await this.reservationRepo.save(reservation);
    await this.historyService.logOperation({
      sku,
      warehouseId,
      type: 'manual_reserve',
      quantityChange: -quantity,
      initiator: 'Manual',
      details: comment,
      orderId: null,
    });
    this.amqpConnection.publish('inventory', 'inventory.stock_reserved', { reservationId: reservation.id, sku, quantity, warehouseId });
    return reservation;
  }

  async releaseReservation(reservationId: number) {
    const res = await this.reservationRepo.findOne({ where: { id: reservationId, status: 'active' }, relations: ['warehouse'] });
    if (!res) {
      throw new NotFoundException(`Active reservation not found: ${reservationId}`);
    }
    const stock = await this.stockRepo.findOne({ where: { sku: res.sku, warehouse: { id: res.warehouse.id } }, relations: ['warehouse'] });
    if (stock) {
      stock.reserved -= res.quantity;
      await this.stockRepo.save(stock);
    }
    res.status = 'cancelled';
    await this.reservationRepo.save(res);
    await this.historyService.logOperation({
      sku: res.sku,
      warehouseId: res.warehouse.id,
      type: 'manual_release',
      quantityChange: res.quantity,
      initiator: 'Manual',
      details: res.comment,
      orderId: res.orderId,
    });
    this.amqpConnection.publish('inventory', 'inventory.stock_released', { reservationId });
    return res;
  }
}