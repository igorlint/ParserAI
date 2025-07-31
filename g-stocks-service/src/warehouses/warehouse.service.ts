import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';

@Injectable()
export class WarehousesService {
  constructor(@InjectRepository(Warehouse) private readonly repo: Repository<Warehouse>) {}

  findAll(): Promise<Warehouse[]> {
    return this.repo.find();
  }

  findByRegion(region: string): Promise<Warehouse[]> {
    return this.repo.find({ where: { region } });
  }
}
