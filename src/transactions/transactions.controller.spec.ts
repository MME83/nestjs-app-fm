import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  const mockTransactionsService = {
    addTransaction: jest.fn(() => {
      return {};
    }),
  };
  const mockConfigService = {
    get: jest.fn((API_KEY) => {
      return API_KEY;
    }),
  };
  const mockHttpService = {
    post: jest.fn(() => {
      return 'ok';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService, ConfigService, HttpService],
    })
      .overrideProvider(TransactionsService)
      .useValue(mockTransactionsService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('Transaction controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('TransactionService should be defined in TransactionController', () => {
    expect(mockTransactionsService).toBeDefined();
  });

  it('ConfigService should be defined', () => {
    expect(mockConfigService).toBeDefined();
  });

  it('HttpService should be defined', () => {
    expect(mockHttpService).toBeDefined();
  });
});
