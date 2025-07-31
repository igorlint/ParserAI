import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ReservationsService } from '../reservations/reservation.service';
import {
  ORDERS_EXCHANGE,
  ORDER_CREATED_ROUTING_KEY,
  ORDER_CANCELLED_ROUTING_KEY,
} from './events.constants';

@Injectable()
export class EventsService {
  constructor(
    @Inject(forwardRef(() => ReservationsService))
    private readonly reservationsService: ReservationsService,
  ) {}

  @RabbitSubscribe({
    exchange: ORDERS_EXCHANGE,
    routingKey: ORDER_CREATED_ROUTING_KEY,
    queue: 'orders_created_queue',
  })
  async handleOrderCreated(msg: {
    orderId: string;
    region: string;
    items: { sku: string; quantity: number }[];
    partialAllowed?: boolean;
  }) {
    const { orderId, region, items, partialAllowed } = msg;
    await this.reservationsService.reserveOrder(orderId, items, region, partialAllowed);
  }

  @RabbitSubscribe({
    exchange: ORDERS_EXCHANGE,
    routingKey: ORDER_CANCELLED_ROUTING_KEY,
    queue: 'orders_cancelled_queue',
  })
  async handleOrderCancelled(msg: { orderId: string }) {
    const { orderId } = msg;
    await this.reservationsService.releaseOrder(orderId);
  }
}
