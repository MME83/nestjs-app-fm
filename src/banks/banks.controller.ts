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
import { descriptions } from '../common/const.descriptions';

@ApiTags('banks')
@Controller('api/banks')
//@ApiExtraModels(ResponseSuccess)
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post()
  @ApiOperation({ description: descriptions.CREATE_ENTITY })
  @ApiSwaggerResponse(Bank)
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiConflictResponse({
    description: descriptions.CONFLICT_NAME,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  async createBank(
    @Body() createBankDto: CreateBankDto,
  ): Promise<ResponseSuccess<Bank>> {
    const data = await this.banksService.createBank(createBankDto);
    return Helper.resSuccess(HttpStatus.CREATED, data);
  }

  @Get()
  @ApiOperation({ description: descriptions.GET_ALL })
  @ApiSwaggerResponseArr(Bank)
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  async getBanks(): Promise<ResponseSuccess<Bank[]>> {
    const data = await this.banksService.getBanks();
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Get(':id')
  @ApiOperation({ description: descriptions.GET_ONEBY_ID })
  @ApiSwaggerResponse(Bank)
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
  async getBankById(
    @Param() getBankDto: GetBankDto,
  ): Promise<ResponseSuccess<Bank>> {
    const data = await this.banksService.getBankById(getBankDto);
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Patch(':id')
  @ApiOperation({
    description: descriptions.UPDATE_ENTITY_UNIQUE_NAME,
  })
  @ApiSwaggerResponse(Bank)
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiNotFoundResponse({
    description: descriptions.NOT_FOUND,
    type: SwaggerApiError,
  })
  @ApiConflictResponse({
    description: descriptions.CONFLICT_NAME,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
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
    description: descriptions.DELETE_ENTITY_NO_TRANSACTIONS,
  })
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiNotFoundResponse({
    description: descriptions.NOT_FOUND,
    type: SwaggerApiError,
  })
  @ApiConflictResponse({
    description: descriptions.CONFLICT_TRANSACTIONS,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  deleteBankById(@Param() getBankDto: GetBankDto): Promise<void> {
    return this.banksService.deleteBankById(getBankDto);
  }
}
