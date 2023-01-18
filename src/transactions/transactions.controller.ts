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
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CustomErrorException } from '../utilities/custom.error.exception';
import { domains } from '../common/const.domains';
import {
  ApiSwaggerResponse,
  ApiSwaggerResponseArr,
  ResponseSuccess,
  SwaggerApiError,
} from '../utilities/helper.dto';
import { Helper } from '../utilities/helper';
import { headers_const } from '../common/const.headers';
import { descriptions } from '../common//const.descriptions';

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
  @ApiOperation({ description: descriptions.CREATE_ENTITY })
  @ApiSwaggerResponse(Transaction)
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  async addTransaction(
    @Headers() headers: TransactionHeaderDto,
    @Body() transactionDto: CreateTransactionDto,
  ): Promise<ResponseSuccess<Transaction>> {
    const apiKey = this.configService.get('API_KEY');

    if (headers['fm-api-key'] !== apiKey) {
      throw new UnauthorizedException();
    }

    if (headers['content-type'] !== headers_const.CONTENT_TYPE) {
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
  @ApiOperation({ description: descriptions.GET_ALL })
  @ApiSwaggerResponseArr(Transaction)
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  async getTransactions(
    @Query() paginationDto: PaginationDto,
  ): Promise<ResponseSuccess<Transaction[]>> {
    const data = await this.transactionsService.getTransactions(paginationDto);
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Delete(':id')
  @ApiOperation({ description: descriptions.DELETE_ONEBY_ID })
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiNotFoundResponse({
    description: descriptions.NOT_FOUND,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  deleteTransactionById(
    @Param() transactionId: IdTransactionDto,
  ): Promise<void> {
    return this.transactionsService.deleteTransactionById(transactionId);
  }
}
