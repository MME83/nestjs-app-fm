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
//import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class CategoriesService {
  constructor(
    //@InjectRepository(Transaction)
    //private readonly transactionsRepository: Repository<Transaction>,
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

  async getCategoriesByIds(categoryIds: CategoryIdDto[]): Promise<Category[]> {
    return await this.categoriesRepository.find({
      where: { id: In(categoryIds) },
      relations: {
        transactions: true,
      },
      select: {
        transactions: {
          id: true,
          amount: true,
          type: true,
          createdAt: true,
        },
      },
    });
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

    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: { transactions: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with id:'${id}' not found`);
    }

    if (category.transactions?.length > 0) {
      throw new ConflictException(
        "Can't update category with existing transactions",
      );
    }

    if (name === category.name) {
      throw new ConflictException(
        `Category with name:'${name}' is already exists`,
      );
    }

    return await this.categoriesRepository.save({ ...category, name });
    /*
    // for future
    const transactions = await this.transactionsRepository.find({
      relations: { categories: true },
      where: { categories: { id: category.id } },
    });

    // array of promises to update and save each transaction
    const updateTransactions = transactions.map((transaction) => {
      if (!transaction.category.includes(name)) {
        transaction.categories = transaction.categories.filter(
          (cat) => cat.id !== category.id,
        );

        return this.transactionsRepository.save(transaction);
      }
    });

    // save all the updated transactions in parallel
    await Promise.all(updateTransactions);

    return await this.categoriesRepository.findOneBy({ id });
    */
  }

  async deleteCategoryById(categoryId: CategoryIdDto): Promise<void> {
    const { id } = categoryId;
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: { transactions: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    if (category.transactions?.length > 0) {
      throw new ConflictException(
        "Can't delete category with existing transactions.",
      );
    }

    await this.categoriesRepository.remove(category);
  }
}
