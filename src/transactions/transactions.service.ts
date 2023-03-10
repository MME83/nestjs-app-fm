import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import {
  CreateTransactionDto,
  IdTransactionDto,
  PaginationDto,
} from './transaction.dto';
import { Transaction } from './transaction.entity';
import { BanksService } from '../banks/banks.service';
import { CategoriesService } from '../categories/categories.service';
import { pagination } from '../common/const.pagination';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly bankService: BanksService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  async addTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const bank = await this.bankService.getBankById({
      id: createTransactionDto.bankId,
    });

    const newTransaction =
      this.transactionsRepository.create(createTransactionDto);
    newTransaction.bank = { ...bank };

    const categories = await this.categoriesService.getCategoriesByNames(
      createTransactionDto.category,
    );

    newTransaction.categories = [...categories];

    const savedTransaction = await this.transactionsRepository.save(
      newTransaction,
    );

    const updatedBank = await this.bankService.calculateBankBalance(
      bank,
      createTransactionDto.amount,
      createTransactionDto.type,
    );

    savedTransaction.bank.balance = updatedBank.balance;

    return savedTransaction;
  }

  async getTransactions(
    paginationDto: PaginationDto,
  ): Promise<Array<Transaction>> {
    const { page = pagination.DEFAULT_PAGE, limit = pagination.DEFAULT_PAGE } =
      paginationDto;
    const offset = (page - 1) * limit;

    const transactions = await this.transactionsRepository.find({
      take: limit,
      skip: offset,
      relations: {
        bank: true,
        categories: true,
      },
      select: {
        bank: {
          id: true,
          name: true,
        },
        categories: {
          id: true,
          name: true,
        },
      },
    });

    return transactions;
  }

  async getTransactionsByCategoryName(
    categoryName: string,
  ): Promise<Transaction[]> {
    const transactions = await this.transactionsRepository.find({
      where: {
        //category: Like(`%${categoryName}%`),
        category: ArrayContains([categoryName]),
      },
    });

    return transactions;
  }

  async deleteTransactionById(transactionId: IdTransactionDto): Promise<void> {
    const { id } = transactionId;
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: { bank: true, categories: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    const { bank } = transaction;
    transaction.amount = -transaction.amount;

    await this.bankService.calculateBankBalance(
      bank,
      transaction.amount,
      transaction.type,
    );

    await this.transactionsRepository.remove(transaction);
  }
}
