import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.FINANCE_SERVICE_DB_HOST || 'localhost',
  port: process.env.FINANCE_SERVICE_DB_PORT
    ? +process.env.FINANCE_SERVICE_DB_PORT
    : 5432,
  dbName: process.env.FINANCE_SERVICE_DB_DATABASE,
  user: process.env.FINANCE_SERVICE_DB_USER,
  password: process.env.FINANCE_SERVICE_DB_PASSWORD,
  schema: process.env.FINANCE_SERVICE_DB_SCHEMA,

  // entityRepository: BaseRepository,

  debug: false,
  // process.env.NODE_ENV !== NodeEnv.Production ||
  // Boolean(process.env.FINANCE_SERVICE_DB_DEBUG),

  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],

  extensions: [Migrator],
  migrations: {
    pathTs: path.join(process.cwd(), 'src/database/migrations'),
    path: path.join(process.cwd(), 'dist/database/migrations'),
  },
});
