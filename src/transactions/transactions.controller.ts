import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  IdTransactionDto,
  PaginationDto,
  TransactionHeaderDto,
} from './transaction.dto';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * webhook
   * @param transactionDto
   * @returns
   */
  @Post()
  async addTransaction(
    @Headers() headers: TransactionHeaderDto,
    @Body() transactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const apiKey = this.configService.get('API_KEY');

    if (headers['fm-api-key'] !== apiKey) {
      throw new UnauthorizedException();
    }

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
