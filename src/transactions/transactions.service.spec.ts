import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { BanksService } from '../banks/banks.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionsRepository: jest.Mocked<Repository<Transaction>>;
  const TRANSACTION_REPO_TOKEN = getRepositoryToken(Transaction);
  const mockCategoriesService = {
    getCategoriesByNames: jest.fn(() => {
      return {};
    }),
    calculateBankBalance: jest.fn(() => {
      return {};
    }),
  };
  const mockBanksService = {
    getBankById: jest.fn(() => {
      return {};
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TRANSACTION_REPO_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: BanksService, useValue: mockBanksService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get(getRepositoryToken(Transaction));
  });

  it('TransactionService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('transactionsRepository should be defined', () => {
    expect(transactionsRepository).toBeDefined();
  });

  it('banksService should be defined in Transaction Service', () => {
    expect(mockBanksService).toBeDefined();
  });

  it('categoriesService should be defined in TransactionsService', () => {
    expect(mockCategoriesService).toBeDefined();
  });
});
