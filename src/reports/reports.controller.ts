import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetReportDto, ReportDto, SwaggerReportRes } from './report.dto';
import { ReportsService } from './reports.service';
import { ResponseSuccess, SwaggerApiError } from '../utilities/helper.dto';
import { Helper } from '../utilities/helper';
import { descriptions } from '../common/const.descriptions';

@ApiTags('reports')
@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/')
  @ApiOperation({ description: descriptions.GET_REPORT })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerReportRes,
  })
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  async getReport(
    @Query() getReportDto: GetReportDto,
  ): Promise<ResponseSuccess<ReportDto>> {
    const data = await this.reportsService.getReport(getReportDto);
    return Helper.resSuccess(HttpStatus.OK, data);
  }
}
