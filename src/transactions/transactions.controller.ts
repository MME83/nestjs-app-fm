import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, IdTransactionDto } from './transaction.dto';
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
  async getTransactions(): Promise<Transaction[]> {
    return await this.transactionsService.getTransactions();
  }

  @Delete(':id')
  deleteTransactionById(
    @Param() transactionId: IdTransactionDto,
  ): Promise<void> {
    return this.transactionsService.deleteTransactionById(transactionId);
  }
}
