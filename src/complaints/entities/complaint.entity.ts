import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ProductType {
  TV = 'TV',
  PHONE = 'PHONE',
  REFRIGERATOR = 'REFRIGERATOR',
}

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegramId: number;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.PHONE,
  })
  productType: ProductType;

  @CreateDateColumn()
  createdAt: Date;
}
