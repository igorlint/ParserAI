import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockHistory } from './entities/stock-history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(StockHistory)
    private readonly historyRepo: Repository<StockHistory>,
  ) {}

  async logOperation(data: {
    sku: string;
    warehouseId: number;
    type: string;
    quantityChange: number;
    initiator: string;
    orderId?: string;
    details?: string;
  }): Promise<StockHistory> {
    const record = this.historyRepo.create(data);
    return this.historyRepo.save(record);
  }

  async findHistory(filter: {
    sku?: string;
    warehouseId?: number;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<StockHistory[]> {
    const {
      sku,
      warehouseId,
      type,
      dateFrom,
      dateTo,
      limit = 100,
      offset = 0,
    } = filter;
    const qb = this.historyRepo.createQueryBuilder('history');
    if (sku) qb.andWhere('history.sku = :sku', { sku });
    if (warehouseId)
      qb.andWhere('history.warehouseId = :warehouseId', { warehouseId });
    if (type) qb.andWhere('history.type = :type', { type });
    if (dateFrom)
      qb.andWhere('history.createdAt >= :dateFrom', { dateFrom });
    if (dateTo)
      qb.andWhere('history.createdAt <= :dateTo', { dateTo });
    qb.orderBy('history.createdAt', 'DESC')
      .skip(offset)
      .take(limit);
    return qb.getMany();
  }
}