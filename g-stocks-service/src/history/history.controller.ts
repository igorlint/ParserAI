import { Controller, Get, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { StockHistory } from './entities/stock-history.entity';

@Controller('api/stock/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async findAll(
    @Query('sku') sku?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('type') type?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<StockHistory[]> {
    const filter = {
      sku,
      warehouseId: warehouseId ? parseInt(warehouseId, 10) : undefined,
      type,
      dateFrom,
      dateTo,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.historyService.findHistory(filter);
  }
}
