import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { TransactionsService } from '../transactions/transactions.service';

describe('CategoryService', () => {
  let service: CategoriesService;
  let categoriesRepository: jest.Mocked<Repository<Category>>;
  const CATEGORY_REPO_TOKEN = getRepositoryToken(Category);
  const mockTransactionsService = {
    getTransactionsByCategoryName: jest.fn(() => {
      return {};
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: CATEGORY_REPO_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('category service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('categoriesRepository should be defined', () => {
    expect(categoriesRepository).toBeDefined();
  });

  it('transactionService should be defined', () => {
    expect(mockTransactionsService).toBeDefined();
  });
});
