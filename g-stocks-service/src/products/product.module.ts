import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
