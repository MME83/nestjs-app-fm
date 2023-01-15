import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [CategoriesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
