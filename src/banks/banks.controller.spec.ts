import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';

describe('BanksController', () => {
  let controller: BanksController;
  const mockDto = {
    id: '5323227b-d0d4-4789-b9d5-ddd7202c1e73',
    name: 'Some bank',
    amount: 0,
    createdAt: new Date(2),
    updatedAt: new Date(2),
  };

  const mockBanksService = {
    createBank: jest.fn((dto) => {
      return {
        //id: '5323227b-d0d4-4789-b9d5-ddd7202c1e73',
        ...dto,
      };
    }),
    getBanks: jest.fn().mockImplementation(() => [mockDto]),
    getBankById: jest.fn().mockImplementation((id) => ({
      id,
      ...mockDto,
    })),
    updateBankById: jest.fn().mockImplementation((id, dto) => ({
      id: '1',
      ...dto,
    })),
    deleteBankById: jest.fn().mockImplementationOnce(() => 1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BanksController],
      providers: [BanksService],
    })
      .overrideProvider(BanksService)
      .useValue(mockBanksService)
      .compile();

    controller = module.get<BanksController>(BanksController);
  });

  it('banksController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createBank, should create a bank', async () => {
    const dto = { name: 'Some Bank' };
    //    id: expect.any(String),

    const res = await controller.createBank(dto);

    expect(mockBanksService.createBank).toHaveBeenCalledWith(dto);
    expect(res).toEqual({
      status: 'success',
      statusCode: HttpStatus.CREATED,
      data: dto,
    });
  });

  it('getBanks, should get all banks', async () => {
    // jest.spyOn(mockBanksService, 'getBanks').mockResolvedValueOnce([mockDto]);
    const res = await controller.getBanks();

    expect(mockBanksService.getBanks).toHaveBeenCalled();
    expect(res).toEqual({
      status: 'success',
      statusCode: HttpStatus.OK,
      data: [mockDto],
    });
  });

  it('getBankById, should get bank by id', async () => {
    const idDto = { id: '123' };
    const res = await controller.getBankById(idDto);

    expect(mockBanksService.getBankById).toHaveBeenCalledWith(idDto);
    expect(res).toEqual({
      status: 'success',
      statusCode: HttpStatus.OK,
      data: mockDto,
    });
  });

  it('updateBankById, should update a bank', async () => {
    const dto = { name: 'Unix Bank' };

    const res = await controller.updateBankById({ id: '1' }, dto);

    expect(mockBanksService.updateBankById).toHaveBeenCalled();
    expect(res).toEqual({
      status: 'success',
      statusCode: HttpStatus.OK,
      data: {
        id: '1',
        ...dto,
      },
    });
  });

  it('it should delete user', async () => {
    const dto = { id: '123' };

    const res = await controller.deleteBankById(dto);

    expect(mockBanksService.deleteBankById).toHaveBeenCalled();
    expect(res).toEqual(1);
  });
});
