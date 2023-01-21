import { DataSource, DataSourceOptions } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
// import { config } from 'dotenv';

// config();

//const configService = new ConfigService();

//const { DB_TYPE, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_DATABASE } =
//  process.env;
//console.log(DB_TYPE);

// export default new DataSource({
//   type: DB_TYPE,
//   host: DB_HOST,
//   port: Number(DB_PORT),
//   username: DB_USERNAME,
//   password: DB_PASSWORD,
//   database: DB_DATABASE,
//   entities: [__dirname + '/src/**/*.entity.{ts,js}'],
//   migrations: [__dirname + 'db/migrations/*{.ts,.js}'],
// } as DataSourceOptions);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: ['src/**/*.entity.ts'],
  logging: true,
  synchronize: false,
  migrations: ['db/migrations/*.ts'],
  migrationsTableName: 'migrations',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
