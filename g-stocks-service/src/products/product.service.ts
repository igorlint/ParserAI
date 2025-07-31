import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Stock) private readonly stockRepo: Repository<Stock>) {}

  async getStockBySku(sku: string, region?: string) {
    const qb = this.stockRepo.createQueryBuilder('stock')
      .leftJoinAndSelect('stock.warehouse', 'warehouse')
      .where('stock.sku = :sku', { sku });
    if (region) {
      qb.andWhere('warehouse.region = :region', { region });
    }
    const stocks = await qb.getMany();
    if (!stocks.length) {
      throw new NotFoundException(`Stock not found for SKU ${sku}`);
    }
    const data = stocks.map(s => ({
      warehouseId: s.warehouse.id,
      warehouseName: s.warehouse.name,
      region: s.warehouse.region,
      total: s.total,
      reserved: s.reserved,
      available: s.total - s.reserved,
    }));
    const totalAvailable = data.reduce((sum, s) => sum + s.available, 0);
    return { sku, stocks: data, totalAvailable };
  }

  async getAvailableBySku(sku: string, region?: string) {
    const { totalAvailable } = await this.getStockBySku(sku, region);
    return { sku, totalAvailable, region };
  }
}
