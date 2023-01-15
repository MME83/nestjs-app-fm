import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  ArrayUnique,
  ArrayMinSize,
  //ArrayNotEmpty,
  IsDate,
} from 'class-validator';
import { CategoryIdDto } from '../categories/category.dto';

export class GetReportDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  public categoryIds!: CategoryIdDto[];

  @IsNotEmpty()
  @Type(() => Date)
  //@Transform((value) => value.toISOString())
  @IsDate()
  public fromPeriod!: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  public toPeriod!: Date;
}

export interface ReportDto {
  [key: string]: number;
}
