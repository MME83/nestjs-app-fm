import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
//import { BanksService } from '../banks/banks.service';
import { BanksModule } from '../banks/banks.module';
//import { Bank } from './../banks/bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), BanksModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
