import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  const mockReportsService = {
    getReport: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [ReportsService],
    })
      .overrideProvider(ReportsService)
      .useValue(mockReportsService)
      .compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('Reports controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('ReportsService in controller should be defined', () => {
    expect(mockReportsService).toBeDefined();
  });
});
