import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsEnum,
  IsArray,
  IsInt,
  Min,
  IsString,
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

export class PaginationDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsInt()
  @Type(() => Number)
  limit?: number;
}

export class TransactionHeaderDto {
  @IsString()
  @IsNotEmpty()
  'fm-api-key'!: string;
  'Content-Type'!: 'application/json';
}
