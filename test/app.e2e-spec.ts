import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(200).expect(200);
  });

  describe('BanksModule', () => {
    const res = { status: 'success', statusCode: 200, data: {} };

    // first, clear all transactions & banks from db
    beforeEach(async () => {
      const unclearedTransactions = await request(app.getHttpServer()).get(
        '/api/transactions?page=1&limit=100',
      );
      await Promise.all(
        unclearedTransactions.body.data.map(async (transaction) => {
          return await request(app.getHttpServer()).delete(
            `/api/transactions/${transaction.id}`,
          );
        }),
      );

      const unclearedBanks = await request(app.getHttpServer()).get(
        '/api/banks',
      );
      await Promise.all(
        unclearedBanks.body.data.map(async (bank) => {
          return await request(app.getHttpServer()).delete(
            `/api/banks/${bank.id}`,
          );
        }),
      );

      console.log('Transactions & Banks have been deleted from DB');
    });

    it('Post bank, get all, get by id, update by id, get by id, delete', async () => {
      // Post bank
      const bank = {
        name: 'New SCS bank',
      };

      const data = await request(app.getHttpServer())
        .post('/api/banks')
        .send(bank)
        .expect(201);

      expect(data.body).toEqual({
        ...res,
        statusCode: 201,
        data: {
          ...bank,
          id: expect.any(String),
          balance: 0,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });

      // Get all banks
      const banks = await request(app.getHttpServer())
        .get('/api/banks')
        .expect(200);

      expect(banks.body.data).toEqual(expect.any(Array));
      expect(banks.body.data.length).toBe(1);
      expect(banks.body.data[0]).toEqual({
        ...bank,
        id: expect.any(String),
        balance: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      // Get bank by id
      const bank2 = await request(app.getHttpServer())
        .get(`/api/banks/${data.body.data.id}`)
        .expect(200);

      expect(bank2.body).toEqual({ ...data.body, statusCode: 200 });

      // Update bank by id
      const bank3 = await request(app.getHttpServer())
        .patch(`/api/banks/${bank2.body.data.id}`)
        .send({ name: 'SCS bank' })
        .expect(200);
      expect(bank3.body.data).toEqual({
        ...bank2.body.data,
        updatedAt: expect.any(String),
        name: 'SCS bank',
      });

      // Get bank by id
      const updatedBank = await request(app.getHttpServer())
        .get(`/api/banks/${data.body.data.id}`)
        .expect(200);
      expect(updatedBank.body).toEqual({ ...bank3.body, statusCode: 200 });

      // delete bank
      return request(app.getHttpServer())
        .delete(`/api/banks/${data.body.data.id}`)
        .expect(200);
    });
  });
});
