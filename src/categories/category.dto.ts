import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

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
  @IsUUID()
  id: string;
}
