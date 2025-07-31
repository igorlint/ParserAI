import { Module, forwardRef } from '@nestjs/common';
import { ReservationsModule } from '../reservations/reservation.module';
import { EventsService } from './events.service';

@Module({
  imports: [forwardRef(() => ReservationsModule)],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}