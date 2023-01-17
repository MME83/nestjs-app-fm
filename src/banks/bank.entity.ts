import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 64, unique: true })
  public name!: string;

  @ApiProperty()
  @Column({ default: 0 })
  public balance!: number;

  /**
   * Create and Update Date Columns
   */
  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  /**
   * Relations with transactions, one-to-many (bank -> transactions)
   */
  @ApiProperty({
    description: 'Transaction entity, OneToMany relation',
  })
  @ApiPropertyOptional()
  @OneToMany(() => Transaction, (transaction) => transaction.bank)
  transactions: Transaction[];
}
