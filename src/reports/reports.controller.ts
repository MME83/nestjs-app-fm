import { Controller, Get, Query } from '@nestjs/common';
import { GetReportDto } from './report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/')
  async getReport(@Query() getReportDto: GetReportDto) {
    return await this.reportsService.getReport(getReportDto);
  }
}
