import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { rabbitMQConfig } from './config/rabbitmq.config';
import { WarehousesModule } from './warehouses/warehouse.module';
import { ProductsModule } from './products/product.module';
import { ReservationsModule } from './reservations/reservation.module';
import { HistoryModule } from './history/history.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot(typeOrmConfig),
    RabbitMQModule.forRoot(rabbitMQConfig),
    WarehousesModule,
    ProductsModule,
    ReservationsModule,
    HistoryModule,
    EventsModule,
  ],
})
export class AppModule {}

