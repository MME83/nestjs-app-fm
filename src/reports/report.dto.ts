import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/class-transformer';
import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  ArrayUnique,
  ArrayMinSize,
  IsDate,
} from '@nestjs/class-validator';
import { CategoryIdDto } from '../categories/category.dto';

export class GetReportDto {
  @ApiProperty({
    description: 'Category ids in array, UUId type',
    type: 'array',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  public categoryIds!: CategoryIdDto[];

  @ApiProperty({ description: 'From period, date YYYY-MM-DD' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  public fromPeriod!: Date;

  @ApiProperty({ description: 'To period, date YYYY-MM-DD' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  public toPeriod!: Date;
}

export interface ReportDto {
  [key: string]: number;
}

export class SwaggerReportRes {
  @ApiProperty()
  status: 'success';
  @ApiProperty()
  statusCode: number;
  @ApiProperty({
    type: 'object',
    example: { gas: 500, meel: 100, string: 'number' },
  })
  data: Record<keyof string, number>;
}

// @ApiProperty({
//   type: Map,
//   example: { gas: 500, meel: 100, string: 'number' },
// })
// data: Map<string, number>
