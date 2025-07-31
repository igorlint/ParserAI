import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { WarehousesService } from './warehouse.service';
import { WarehousesController } from './warehouse.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  providers: [WarehousesService],
  controllers: [WarehousesController],
  exports: [WarehousesService],
})
export class WarehousesModule {}
