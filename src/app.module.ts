import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configSchemaValidation } from './config.schema';
import { BanksModule } from './banks/banks.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { ReportsService } from './reports/reports.service';
import { ReportsController } from './reports/reports.controller';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`stage.${process.env.STAGE}.env`],
      validationSchema: configSchemaValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          //migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
          synchronize: false,
          logging: true,
        };
      },
    }),
    BanksModule,
    TransactionsModule,
    CategoriesModule,
    ReportsModule,
  ],
  controllers: [AppController, ReportsController],
  providers: [AppService, ReportsService],
})
export class AppModule {}
