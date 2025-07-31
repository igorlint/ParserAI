import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get(':sku/stock')
  getStock(@Param('sku') sku: string, @Query('region') region?: string) {
    return this.service.getStockBySku(sku, region);
  }

  @Get(':sku/stock/available')
  getAvailable(@Param('sku') sku: string, @Query('region') region?: string) {
    return this.service.getAvailableBySku(sku, region);
  }
}
