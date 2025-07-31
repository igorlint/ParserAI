import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Stock } from '../products/entities/stock.entity';
import { Warehouse } from '../warehouses/entities/warehouse.entity';
import { ReservationsService } from './reservation.service';
import { ReservationsController } from './reservation.controller';
import { HistoryModule } from '../history/history.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Stock, Warehouse]),
    HistoryModule,

    forwardRef(() => EventsModule),
  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
