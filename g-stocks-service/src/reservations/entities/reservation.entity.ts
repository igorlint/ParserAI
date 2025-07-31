import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';

export type ReservationType = 'order' | 'manual';
export type ReservationStatus = 'active' | 'cancelled';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  orderId: string;

  @Column()
  sku: string;

  @ManyToOne(() => Warehouse, { eager: true })
  warehouse: Warehouse;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: ['order', 'manual'] })
  type: ReservationType;

  @Column({ type: 'enum', enum: ['active', 'cancelled'], default: 'active' })
  status: ReservationStatus;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
