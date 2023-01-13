import {
  IsNotEmpty,
  //IsString,
  IsNumber,
  IsUUID,
  IsEnum,
  IsArray,
} from 'class-validator';
import { TransactionType } from './transaction.entity';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  public amount!: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  public type!: TransactionType;

  @IsUUID()
  @IsNotEmpty()
  bankId!: string;

  @IsArray()
  @IsNotEmpty()
  category!: string[];
}

export class IdTransactionDto {
  @IsUUID()
  id: string;
}
