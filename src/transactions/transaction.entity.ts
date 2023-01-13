import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  //ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  //JoinColumn,
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

  /**
   * Relations with bank
   */
  @ManyToOne(() => Bank, (bank) => bank.transactions, { cascade: true })
  //@JoinColumn({ name: 'bankId' })
  bank: Bank;

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
