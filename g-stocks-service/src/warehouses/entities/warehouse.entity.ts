import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  region: string;

  @Column({ default: 'main' })
  type: string;

  @Column({ default: 0 })
  priority: number;
}
