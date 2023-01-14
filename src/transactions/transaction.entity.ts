import { Category } from '../categories/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  //BeforeInsert,
  //BeforeUpdate,
} from 'typeorm';
import { Bank } from '../banks/bank.entity';

export enum TransactionType {
  profitable = 'PROFITABLE',
  consumable = 'CONSUMABLE',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public transactionId: string;

  @Column()
  public amount!: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  public type!: TransactionType;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @Column({ type: 'text', array: true, default: [] })
  public category!: string[];

  /**
   * Relations with bank
   */
  @ManyToOne(() => Bank, (bank) => bank.transactions, { cascade: true })
  bank: Bank;

  /**
   * Relations with category
   */
  @ManyToMany(() => Category, (category) => category.transactions, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  /*
  @BeforeInsert()
  @BeforeUpdate()
  calculateBankBalance() {
    if (this.type === 'PROFITABLE') {
      this.bank.balance += this.amount;
    } else {
      this.bank.balance -= this.amount;
    }
  }
  */
}
