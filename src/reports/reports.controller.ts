import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetReportDto, ReportDto } from './report.dto';
import { ReportsService } from './reports.service';
import { ResponseSuccess } from '../utilities/helper.dto';
import { Helper } from '../utilities/helper';

@Controller('api/reports')
@ApiTags('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/')
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async getReport(
    @Query() getReportDto: GetReportDto,
  ): Promise<ResponseSuccess<ReportDto>> {
    const data = await this.reportsService.getReport(getReportDto);
    return Helper.resSuccess(HttpStatus.OK, data);
  }
}
