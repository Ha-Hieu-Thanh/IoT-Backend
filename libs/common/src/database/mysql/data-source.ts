import { DataSource } from 'typeorm';
import entities from './entities';
import migrations from './migrations';

require('dotenv').config();

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  timezone: 'Z',
  charset: 'utf8mb4',
  bigNumberStrings: false,
  entities: [...entities],
  migrations: [...migrations],
  subscribers: [],
  synchronize: false,
});
