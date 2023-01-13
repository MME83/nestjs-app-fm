import {
  //ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto, IdTransactionDto } from './transaction.dto';
import { Transaction } from './transaction.entity';
import { BanksService } from '../banks/banks.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly bankService: BanksService,
  ) {}

  async addTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const newTransaction =
      this.transactionsRepository.create(createTransactionDto);

    const bank = await this.bankService.getBankById({
      id: createTransactionDto.bankId,
    });

    newTransaction.bank = bank;

    const savedTransaction = await this.transactionsRepository.save(
      newTransaction,
    );

    await this.bankService.calculateBankBalance(
      bank,
      createTransactionDto.amount,
      createTransactionDto.type,
    );

    return savedTransaction;
  }

  async getTransactions(): Promise<Array<Transaction>> {
    const transactions = await this.transactionsRepository.find({
      relations: {
        bank: true,
      },
      select: {
        bank: {
          id: true,
          name: true,
        },
      },
    });

    return transactions;
  }

  async getTransactionsByBankId(bankId: string): Promise<Transaction[] | null> {
    const transactions = await this.transactionsRepository.find({
      where: {
        bank: {
          id: bankId,
        },
      },
    });

    return transactions;
  }

  async deleteTransactionById(transactionId: IdTransactionDto): Promise<void> {
    const { id } = transactionId;
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: { bank: true },
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
