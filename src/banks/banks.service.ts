import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBankDto, GetBankDto, UpdateBankDto } from './bank.dto';
import { Bank } from './bank.entity';
import { TransactionType } from '../transactions/transaction.entity';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Bank) private readonly banksRepository: Repository<Bank>, //private readonly transactionsService: TransactionsService,
  ) {}

  async createBank(createBankDto: CreateBankDto): Promise<Bank> {
    const { name } = createBankDto;
    const bank = await this.banksRepository.findOne({ where: { name } });

    if (bank) {
      throw new ConflictException(
        `Bank with name: '${createBankDto.name}' already exists`,
      );
    }

    const newBank = this.banksRepository.create(createBankDto);
    const savedBank = await this.banksRepository.save(newBank);

    return savedBank;
  }

  async getBanks(): Promise<Array<Bank>> {
    const banks = await this.banksRepository.find({});

    return banks;
  }

  async getBankById(getBankDto: GetBankDto): Promise<Bank> {
    const { id } = getBankDto;
    const bank = await this.banksRepository.findOneBy({ id });

    if (!bank) {
      throw new NotFoundException(`Bank with id ${id} not found`);
    }

    return bank;
  }

  async updateBankById(
    getBankDto: GetBankDto,
    updateBankDto: UpdateBankDto,
  ): Promise<Bank> {
    const { id } = getBankDto;
    const bank = await this.banksRepository.findOneBy({ id });

    if (!bank) {
      throw new NotFoundException(`Bank with id: '${id}' not found`);
    }

    const { name } = updateBankDto;

    if (name === bank.name) {
      throw new ConflictException(
        `Bank with name: '${name}' is already exists`,
      );
    }

    const updatedBank = await this.banksRepository.save({ ...bank, name });

    return updatedBank;
  }

  async deleteBankById(getBankDto: GetBankDto): Promise<void> {
    const { id } = getBankDto;
    const bank = await this.banksRepository.find({
      where: { id },
      relations: { transactions: true },
      take: 1,
    });

    if (!bank) {
      throw new NotFoundException(`Bank with id ${id} not found`);
    }

    if (bank[0].transactions?.length > 0) {
      throw new ConflictException(
        "Can't delete bank with existing transactions. Please delete transactions first.",
      );
    }

    await this.banksRepository.remove(bank[0]);
  }

  async calculateBankBalance(
    bank: Bank,
    amount: number,
    transactionType: TransactionType,
  ): Promise<Bank> {
    if (transactionType === TransactionType.profitable) {
      bank.balance += amount;
    } else {
      bank.balance -= amount;
    }

    return await this.banksRepository.save(bank);
  }
}
