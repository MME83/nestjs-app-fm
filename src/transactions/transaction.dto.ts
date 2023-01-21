import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsEnum,
  IsArray,
  IsInt,
  Min,
  IsString,
  IsDefined,
} from '@nestjs/class-validator';
import { headers_const } from '../common/const.headers';
import { TransactionType } from './transaction.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  public transactionId: string;

  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  public amount!: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  @IsDefined()
  public type!: TransactionType;

  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  bankId!: string;

  @IsArray()
  @IsNotEmpty()
  @IsDefined()
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
  @ApiProperty({
    description: 'webhook api-key',
    default: '12313asasasas%43r34f',
  })
  @IsString()
  @IsNotEmpty()
  'fm-api-key'!: string;

  @ApiProperty({
    description: 'Header content-type',
    type: 'string',
    name: 'content-type',
    required: true,
    default: 'application/json',
  })
  @IsString()
  @IsNotEmpty()
  'content-type' = headers_const.CONTENT_TYPE;
}
