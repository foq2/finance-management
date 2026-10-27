import { registerAs } from '@nestjs/config';

export const databaseConfiguration = registerAs('database', () => ({
  databaseUrl: process.env.URL,
}));
