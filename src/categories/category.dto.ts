import { IsNotEmpty, IsString, IsUUID, Length } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  public name: string;
}

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  public name: string;
}

export class CategoryIdDto {
  @ApiProperty({
    description: 'Category id, UUId type',
    type: 'string',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
