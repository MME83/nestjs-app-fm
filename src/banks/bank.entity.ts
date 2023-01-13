import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Bank {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  public name!: string;

  @Column({ default: 0 })
  public balance!: number;

  /**
   * Create and Update Date Columns
   */
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  /**
   * Relations with transactions
   */
  @OneToMany(() => Transaction, (transaction) => transaction.bank)
  transactions: Transaction[];
}
