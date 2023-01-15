import { Injectable } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { GetReportDto, ReportDto } from './report.dto';
import { TransactionType } from '../transactions/transaction.entity';

@Injectable()
export class ReportsService {
  constructor(private readonly categoriesService: CategoriesService) {}

  async getReport(getReportDto: GetReportDto): Promise<ReportDto> {
    const { categoryIds, fromPeriod, toPeriod } = getReportDto;
    const categories = await this.categoriesService.getCategoriesByIds(
      categoryIds,
    );
    const report = {};

    categories.forEach((category) => {
      const transactionsInRange = category.transactions.filter(
        (transaction) =>
          transaction.createdAt >= new Date(fromPeriod) &&
          transaction.createdAt <= new Date(toPeriod),
      );

      if (transactionsInRange.length) {
        const totalAmount = transactionsInRange.reduce(
          (acc, cur) =>
            acc +
            (cur.type === TransactionType.profitable
              ? cur.amount
              : -cur.amount),
          0,
        );

        report[category.name] = totalAmount;
      }
    });

    return report;
  }
}
