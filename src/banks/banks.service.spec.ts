import { Test, TestingModule } from '@nestjs/testing';
import { BanksService } from './banks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { Repository } from 'typeorm';
import { CreateBankDto, GetBankDto, UpdateBankDto } from './bank.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  TransactionType,
  Transaction,
} from '../transactions/transaction.entity';

describe('BanksService', () => {
  let service: BanksService;
  let banksRepository: jest.Mocked<Repository<Bank>>;
  const BANK_REPO_TOKEN = getRepositoryToken(Bank);

  const bankA = new Bank();
  Object.assign(bankA, { id: '1', name: 'Bank 1' });
  const bankB = new Bank();
  Object.assign(bankB, { id: '2', name: 'Bank 2' });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BanksService,
        {
          provide: BANK_REPO_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BanksService>(BanksService);
    banksRepository = module.get(getRepositoryToken(Bank));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('banksService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('banksRepository should be defined', () => {
    expect(banksRepository).toBeDefined();
  });

  it('createBank, should be create a new bank by name', async () => {
    const bank: CreateBankDto = { name: 'New bank' };
    const newBank = new Bank();
    newBank.name = bank.name;
    //jest.spyOn(banksRepository, 'findOne').mockReturnValue(undefined);
    banksRepository.findOne.mockResolvedValueOnce(undefined);
    banksRepository.create.mockReturnValue(newBank);
    banksRepository.save.mockResolvedValueOnce(newBank);

    const result = await service.createBank(newBank);

    expect(result).toEqual(newBank);
    expect(banksRepository.create).toHaveBeenCalledWith(bank);
    expect(banksRepository.save).toHaveBeenCalledWith(newBank);
  });

  it('createBank, should be thrown an error if bank name already exists', async () => {
    const newBank: CreateBankDto = { name: 'New bank' };
    const existingBank = new Bank();
    existingBank.name = newBank.name;

    banksRepository.findOne.mockResolvedValueOnce(existingBank);

    await expect(service.createBank(newBank)).rejects.toThrow(
      ConflictException,
    );
  });

  it('getBanks, should get all banks', async () => {
    const banks = [bankA, bankB];

    banksRepository.find.mockResolvedValueOnce(banks);
    const result = await service.getBanks();

    expect(result).toEqual(banks);
    expect(banksRepository.find).toHaveBeenCalledWith({});
  });

  it('getBankById, should get a bank by id', async () => {
    const getBankDto: GetBankDto = { id: bankA.id };

    banksRepository.findOneBy.mockResolvedValueOnce(bankA);
    const result = await service.getBankById(getBankDto);

    expect(result).toEqual(bankA);
    expect(banksRepository.findOneBy).toHaveBeenCalledWith({ id: bankA.id });
  });

  it('getBankById, should throw an error - bank not found', async () => {
    const getBankDto: GetBankDto = { id: bankA.id };
    banksRepository.findOneBy.mockResolvedValueOnce(undefined);

    await expect(service.getBankById(getBankDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('updateBankById, should update a bank by id', async () => {
    const updateBank: UpdateBankDto = { name: 'Updated bank' };
    banksRepository.findOneBy.mockResolvedValueOnce(bankA);
    const updatedBank = new Bank();
    banksRepository.save.mockResolvedValueOnce(
      Object.assign(updatedBank, bankA, updateBank),
    );

    const result = await service.updateBankById({ id: bankA.id }, updateBank);

    expect(result).toEqual(updatedBank);
    expect(banksRepository.findOneBy).toHaveBeenCalledWith({ id: bankA.id });
    expect(banksRepository.save).toHaveBeenCalledWith(updatedBank);
  });

  it('updateBankById, should throw an error - bank not found', async () => {
    const getBankDto: GetBankDto = { id: bankA.id };
    const updateBankDto: UpdateBankDto = { name: bankB.name };
    banksRepository.findOneBy.mockResolvedValueOnce(undefined);

    await expect(
      service.updateBankById(getBankDto, updateBankDto),
    ).rejects.toThrow(NotFoundException);
    expect(banksRepository.findOneBy).toHaveBeenCalledWith({ id: bankA.id });
    expect(banksRepository.save).not.toHaveBeenCalled();
  });

  it('updateBankById, should throw an error - bank name already exists', async () => {
    const getBankDto: GetBankDto = { id: bankA.id };
    const updateBankDto: UpdateBankDto = { name: 'Bank 1' };
    banksRepository.findOneBy.mockResolvedValueOnce(bankA);

    await expect(
      service.updateBankById(getBankDto, updateBankDto),
    ).rejects.toThrow(ConflictException);
    expect(banksRepository.findOneBy).toHaveBeenCalledWith({ id: bankA.id });
    expect(banksRepository.save).not.toHaveBeenCalled();
  });

  it('deleteBankById, should delete a bank by id', async () => {
    const getBankDto: GetBankDto = { id: bankA.id };
    banksRepository.findOne.mockResolvedValueOnce(bankA);
    banksRepository.remove.mockResolvedValueOnce(undefined);

    await service.deleteBankById(getBankDto);

    expect(banksRepository.findOne).toHaveBeenCalledWith({
      where: { id: bankA.id },
      relations: { transactions: true },
    });
    expect(banksRepository.remove).toHaveBeenCalledWith(bankA);
  });

  it('deleteBankById, should throw an error - bank not found', async () => {
    const getBankDto: GetBankDto = { id: bankA.id };
    banksRepository.findOne.mockResolvedValueOnce(null);

    await expect(service.deleteBankById(getBankDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(banksRepository.findOne).toHaveBeenCalledWith({
      where: { id: bankA.id },
      relations: { transactions: true },
    });
    expect(banksRepository.remove).not.toHaveBeenCalled();
  });

  it('deleteBankById, should throw an error - bank has transactions', async () => {
    bankA.transactions = [new Transaction()];

    const getBankDto: GetBankDto = { id: bankA.id };
    banksRepository.findOne.mockResolvedValueOnce(bankA);

    await expect(service.deleteBankById(getBankDto)).rejects.toThrow(
      ConflictException,
    );
    expect(banksRepository.findOne).toHaveBeenCalledWith({
      where: { id: bankA.id },
      relations: { transactions: true },
    });
    expect(banksRepository.remove).not.toHaveBeenCalled();
  });

  it('calculateBankBalance, should calculate bank balance', async () => {
    bankA.balance = 1000;
    let amount = 100;
    let transactionType = TransactionType.consumable;
    //bankA.balance = bankA.balance - amount;
    banksRepository.save.mockResolvedValueOnce(bankA);

    let result = await service.calculateBankBalance(
      bankA,
      amount,
      transactionType,
    );

    expect(result).toEqual(bankA);
    expect(banksRepository.save).toHaveBeenCalledWith(bankA);
    expect(bankA.balance).toEqual(900);

    amount = 200;
    transactionType = TransactionType.profitable;

    result = await service.calculateBankBalance(bankA, amount, transactionType);

    expect(banksRepository.save).toHaveBeenCalledWith(bankA);
    expect(bankA.balance).toEqual(1100);
  });
});
