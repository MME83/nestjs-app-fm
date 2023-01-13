import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BanksService } from './banks.service';
import { CreateBankDto, GetBankDto, UpdateBankDto } from './bank.dto';
import { Bank } from './bank.entity';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post()
  createBank(@Body() createBankDto: CreateBankDto): Promise<Bank> {
    return this.banksService.createBank(createBankDto);
  }

  @Get()
  getBanks(): Promise<Bank[]> {
    return this.banksService.getBanks();
  }

  @Get(':id')
  getBankById(@Param() getBankDto: GetBankDto): Promise<Bank> {
    return this.banksService.getBankById(getBankDto);
  }

  @Patch(':id')
  updateBankById(
    @Param() getBankDto: GetBankDto,
    @Body() updateBankDto: UpdateBankDto,
  ): Promise<Bank> {
    return this.banksService.updateBankById(getBankDto, updateBankDto);
  }

  @Delete(':id')
  deleteBankById(@Param() getBankDto: GetBankDto): Promise<void> {
    return this.banksService.deleteBankById(getBankDto);
  }
}
