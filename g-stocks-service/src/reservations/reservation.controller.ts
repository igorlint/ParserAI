import { Controller, Post, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ReservationsService } from './reservation.service';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('orders/:orderId/reserve')
  async reserveOrder(
    @Param('orderId') orderId: string,
    @Body() body: { region: string; items: { sku: string; quantity: number }[]; partialAllowed?: boolean },
  ) {
    const { region, items, partialAllowed } = body;
    return this.reservationsService.reserveOrder(orderId, items, region, partialAllowed);
  }

  @Delete('orders/:orderId/reserve')
  async releaseOrder(@Param('orderId') orderId: string) {
    return this.reservationsService.releaseOrder(orderId);
  }

  @Post('reservations/manual')
  async manualReserve(
    @Body() body: { sku: string; quantity: number; warehouseId: number; comment?: string },
  ) {
    const { sku, quantity, warehouseId, comment } = body;
    return this.reservationsService.manualReserve(sku, quantity, warehouseId, comment);
  }

  @Delete('reservations/:id')
  async releaseReservation(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.releaseReservation(id);
  }
}
