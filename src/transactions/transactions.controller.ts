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
  Logger,
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
import { HttpService } from '@nestjs/axios';

@Controller('api/transactions')
@ApiTags('transactions')
export class TransactionsController {
  private readonly logger = new Logger(domains.DOMAIN_TRANSACTION);

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * receive new transaction data & our api-key from (Banks Enc.) other webhook bank apps
   * as optional send to client (third app) created transaction data
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
    const informClient = Number(this.configService.get('INFORM_CLIENT'));
    console.log('INFORM_CLIENT', informClient);

    if (informClient) {
      this.httpService
        .post(this.configService.get('WEBHOOK_URI'), data)
        .subscribe({
          complete: () => {
            this.logger.debug(
              `Webhook sent with created transaction: ${JSON.stringify(data)}`,
              `to ${this.configService.get('WEBHOOK_URI')}`,
            );
          },
          error: (err) => {
            this.logger.error(
              `Error: when sending webhook: ${JSON.stringify(err.message)}`,
              `Error.stack: ${this.configService.get(err.stack)}`,
              `sending data, uri: ${JSON.stringify(
                data,
              )}, uri: ${this.configService.get('WEBHOOK_URI')}`,
            );
          },
        });
    }

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
