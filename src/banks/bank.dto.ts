import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 64)
  public name!: string;
}

export class UpdateBankDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 64)
  public name: string;
}

export class GetBankDto {
  @IsUUID()
  id: string;
}
