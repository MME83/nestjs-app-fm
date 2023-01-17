import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { BanksService } from './banks.service';
import { CreateBankDto, GetBankDto, UpdateBankDto } from './bank.dto';
import { Bank } from './bank.entity';
import {
  ApiSwaggerResponse,
  ApiSwaggerResponseArr,
  ResponseSuccess,
  SwaggerApiError,
} from '../utilities/helper.dto';
import { Helper } from '../utilities/helper';
import {
  ApiTags,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('banks')
@Controller('api/banks')
//@ApiExtraModels(ResponseSuccess)
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post()
  @ApiOperation({ description: 'Create Bank entity' })
  @ApiSwaggerResponse(Bank)
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: SwaggerApiError,
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict',
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: SwaggerApiError,
  })
  async createBank(
    @Body() createBankDto: CreateBankDto,
  ): Promise<ResponseSuccess<Bank>> {
    const data = await this.banksService.createBank(createBankDto);
    return Helper.resSuccess(HttpStatus.CREATED, data);
  }

  @Get()
  @ApiOperation({ description: 'Get all Bank entities' })
  @ApiSwaggerResponseArr(Bank)
  @ApiInternalServerErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: SwaggerApiError,
  })
  async getBanks(): Promise<ResponseSuccess<Bank[]>> {
    const data = await this.banksService.getBanks();
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get Bank entity by Id' })
  @ApiSwaggerResponse(Bank)
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: SwaggerApiError,
  })
  @ApiNotFoundResponse({
    description: 'Not found entity',
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    type: SwaggerApiError,
  })
  async getBankById(
    @Param() getBankDto: GetBankDto,
  ): Promise<ResponseSuccess<Bank>> {
    const data = await this.banksService.getBankById(getBankDto);
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Patch(':id')
  @ApiOperation({
    description: 'Update Bank entity by Id, bank property "name" is unique',
  })
  @ApiSwaggerResponse(Bank)
  @ApiBadRequestResponse({
    type: SwaggerApiError,
  })
  @ApiNotFoundResponse({
    description: 'Not found entity',
    type: SwaggerApiError,
  })
  @ApiConflictResponse({
    description: 'Conflict entity name, is already in DB',
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    type: SwaggerApiError,
  })
  async updateBankById(
    @Param() getBankDto: GetBankDto,
    @Body() updateBankDto: UpdateBankDto,
  ): Promise<ResponseSuccess<Bank>> {
    const data = await this.banksService.updateBankById(
      getBankDto,
      updateBankDto,
    );
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Delete(':id')
  @ApiOperation({
    description: 'Delete Bank entity by Id, if bank has no transactions',
  })
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: SwaggerApiError,
  })
  @ApiNotFoundResponse({
    description: 'Not found entity',
    type: SwaggerApiError,
  })
  @ApiConflictResponse({
    description: 'Conflict entity transactions, has transactions',
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    type: SwaggerApiError,
  })
  deleteBankById(@Param() getBankDto: GetBankDto): Promise<void> {
    return this.banksService.deleteBankById(getBankDto);
  }
}
