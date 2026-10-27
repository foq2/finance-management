import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { NodeEnv } from '@repo/nest-common';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.USER_SERVICE_DB_HOST || 'localhost',
  port: process.env.USER_SERVICE_DB_PORT
    ? +process.env.USER_SERVICE_DB_PORT
    : 5432,
  dbName: process.env.USER_SERVICE_DB_DATABASE || 'user',
  user: process.env.USER_SERVICE_DB_USER,
  password: process.env.USER_SERVICE_DB_PASSWORD,
  schema: process.env.USER_SERVICE_DB_SCHEMA,

  // entityRepository: BaseRepository,

  debug: false,
  // process.env.NODE_ENV !== NodeEnv.Production ||
  // Boolean(process.env.USER_SERVICE_DB_DEBUG),

  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],

  extensions: [Migrator],
  migrations: {
    pathTs: path.join(process.cwd(), 'src/database/migrations'),
    path: path.join(process.cwd(), 'dist/database/migrations'),
  },
});
