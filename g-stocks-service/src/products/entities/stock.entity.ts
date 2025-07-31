import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';

@Entity()
@Unique(['sku', 'warehouse'])
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @ManyToOne(() => Warehouse, { eager: true })
  warehouse: Warehouse;

  @Column({ default: 0 })
  total: number;

  @Column({ default: 0 })
  reserved: number;
}
