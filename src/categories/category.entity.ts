import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Category {
  @ApiProperty({ description: 'category id, type UUId' })
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ApiProperty({ description: 'category name is unique' })
  @Column({ type: 'varchar', length: 20, unique: true })
  public name!: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  /**
   * Relations with transactions
   */
  @ApiProperty({
    description: 'Transaction entities, OneToMany relation',
  })
  @ManyToMany(() => Transaction, (transaction) => transaction.categories)
  transactions: Transaction[];
}
