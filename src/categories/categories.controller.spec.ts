import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoryController', () => {
  let controller: CategoriesController;
  let mockCategoriesService = {
    getCategory: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
    })
      .overrideProvider(CategoriesService)
      .useValue(mockCategoriesService)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('Category controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('categoryService should be defined', () => {
    expect(mockCategoriesService).toBeDefined();
  });
});
