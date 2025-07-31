import { Controller, Get, Query } from '@nestjs/common';
import { WarehousesService } from './warehouse.service';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  @Get()
  getAll(@Query('region') region?: string) {
    return region ? this.service.findByRegion(region) : this.service.findAll();
  }
}
