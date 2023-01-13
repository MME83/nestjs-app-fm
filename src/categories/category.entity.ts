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
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  /**
   * Relations with transactions
   */
  @ManyToMany(() => Transaction, (transaction) => transaction.categories)
  transactions: Transaction[];
}
