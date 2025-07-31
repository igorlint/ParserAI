import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class StockHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @Column()
  warehouseId: number;

  @Column()
  type: string;

  @Column()
  quantityChange: number;

  @Column()
  initiator: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  details?: string;

  @CreateDateColumn()
  createdAt: Date;
}
