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
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  IdTransactionDto,
  PaginationDto,
  TransactionHeaderDto,
} from './transaction.dto';
import { Transaction } from './transaction.entity';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomErrorException } from '../utilities/custom.error.exception';
import { domains } from '../common/const.domains';
import { ResponseSuccess } from '../utilities/helper.dto';
import { Helper } from '../utilities/helper';

@Controller('api/transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * webhook
   * @param
   * @returns
   */
  @Post()
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  async addTransaction(
    @Headers() headers: TransactionHeaderDto,
    @Body() transactionDto: CreateTransactionDto,
  ): Promise<ResponseSuccess<Transaction>> {
    const apiKey = this.configService.get('API_KEY');

    if (headers['fm-api-key'] !== apiKey) {
      throw new UnauthorizedException();
    }

    if (headers['Content-Type'] !== 'application/json') {
      throw new CustomErrorException(
        domains.DOMAIN_BANK,
        'Bad Request',
        'Content-Type not a "application/json" type',
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await this.transactionsService.addTransaction(transactionDto);
    return Helper.resSuccess(HttpStatus.CREATED, data);
  }

  @Get()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async getTransactions(
    @Query() paginationDto: PaginationDto,
  ): Promise<ResponseSuccess<Transaction[]>> {
    const data = await this.transactionsService.getTransactions(paginationDto);
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Delete(':id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  deleteTransactionById(
    @Param() transactionId: IdTransactionDto,
  ): Promise<void> {
    return this.transactionsService.deleteTransactionById(transactionId);
  }
}
