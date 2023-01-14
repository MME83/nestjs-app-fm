import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import { Repository, In } from 'typeorm';
import {
  CategoryIdDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './category.dto';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
  ) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoriesRepository.find({
      relations: {
        transactions: true,
      },
      select: {
        transactions: {
          id: true,
          //amount: true,
          //type: true,
          //createdAt: true,
          //bank: {
          //  name: true,
          //},
        },
      },
    });
  }

  async getCategoryById(categoryId: CategoryIdDto): Promise<Category> {
    const { id } = categoryId;
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with id:'${id}' not found`);
    }

    return category;
  }

  async getCategoriesByNames(catNames: string[]): Promise<Category[]> {
    const categories = await this.categoriesRepository.findBy({
      name: In(catNames),
    });

    return categories;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name } = createCategoryDto;
    const category = await this.categoriesRepository.findOne({
      where: { name },
    });

    if (category) {
      throw new ConflictException(
        `Category with name: '${createCategoryDto.name}' is already exists`,
      );
    }

    const newCategory = this.categoriesRepository.create(createCategoryDto);
    const transactions =
      await this.transactionsService.getTransactionsByCategoryName(name);

    if (transactions.length > 0) {
      newCategory.transactions = [...transactions];
    }

    const savedCategory = await this.categoriesRepository.save(newCategory);

    return savedCategory;
  }

  async updateCategoryById(
    categoryId: CategoryIdDto,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const { id } = categoryId;
    const { name } = updateCategoryDto;

    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with id:'${id}' not found`);
    }

    if (name === category.name) {
      throw new ConflictException(
        `Category with name:'${name}' is already exists`,
      );
    }

    return await this.categoriesRepository.save({ ...category, name });
  }

  async deleteCategoryById(categoryId: CategoryIdDto): Promise<void> {
    const { id } = categoryId;
    const category = await this.categoriesRepository.find({
      where: { id },
      relations: { transactions: true },
      take: 1,
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    if (category[0].transactions?.length > 0) {
      throw new ConflictException(
        "Can't delete category with existing transactions. Please delete transactions first.",
      );
    }

    await this.categoriesRepository.remove(category);
  }
}
