import { IsNotEmpty, IsString, IsUUID, Length } from '@nestjs/class-validator';

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
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
