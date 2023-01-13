import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { TransactionType } from './transaction.entity';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  public transactionId: string;

  @IsNumber()
  @IsNotEmpty()
  public amount!: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  public type!: TransactionType;

  @IsUUID()
  @IsNotEmpty()
  bankId: string;
}

export class IdTransactionDto {
  @IsUUID()
  id: string;
}
