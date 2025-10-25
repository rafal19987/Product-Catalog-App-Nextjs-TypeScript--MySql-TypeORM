import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_RUNTIME) {
  config();
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/entities/**/*{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  subscribers: [],
  charset: 'utf8mb4',
  timezone: 'Z',
});
