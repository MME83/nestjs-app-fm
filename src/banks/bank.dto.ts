import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

export class UpdateBankDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

export class GetBankDto {
  @IsUUID()
  id: string;
}
