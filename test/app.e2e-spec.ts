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

    // first, clear all banks from db
    beforeEach(async () => {
      const unclearedTransactions = await request(app.getHttpServer()).get(
        'api/transactions?page=1&limit=100',
      );
      await Promise.all(
        unclearedTransactions.body.data.map(async (transaction) => {
          return request(app.getHttpServer()).delete(
            `/api/transactions/${transaction.id}`,
          );
        }),
      );

      const unclearedBanks = await request(app.getHttpServer()).get(
        'api/banks',
      );
      await Promise.all(
        unclearedBanks.body.data.map(async (bank) => {
          return request(app.getHttpServer()).delete(
            `/api/transactions/${bank.id}`,
          );
        }),
      );
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
          amount: 0,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
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
        amount: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      // Get bank by id
      const bank2 = await request(app.getHttpServer())
        .get(`/api/banks/${data.body.data.id}`)
        .expect(200);

      expect(bank2.body).toEqual(data.body);

      // Update bank by id
      const bank3 = await request(app.getHttpServer())
        .patch(`/api/banks/${data.body.data.id}`)
        .send({ name: 'SCS bank' })
        .expect(200);
      expect(bank3.body.data).toEqual({
        ...data.body.data,
        name: 'SCS bank',
      });

      // Get bank by id
      const updatedBank = await request(app.getHttpServer())
        .get(`/api/banks/${data.body.data.id}`)
        .expect(200);
      expect(updatedBank.body).toEqual(bank3.body);

      // delete bank
      return request(app.getHttpServer())
        .delete(`api/banks/${data.body.data.id}`)
        .expect(200);
      //.expect({ delete: true });
    });
  });
});
