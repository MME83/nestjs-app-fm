import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  IdTransactionDto,
  PaginationDto,
} from './transaction.dto';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async addTransaction(
    @Body() transactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return await this.transactionsService.addTransaction(transactionDto);
  }

  @Get()
  async getTransactions(
    @Query() paginationDto: PaginationDto,
  ): Promise<Transaction[]> {
    return await this.transactionsService.getTransactions(paginationDto);
  }

  @Delete(':id')
  deleteTransactionById(
    @Param() transactionId: IdTransactionDto,
  ): Promise<void> {
    return this.transactionsService.deleteTransactionById(transactionId);
  }
}
