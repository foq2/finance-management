import { registerAs } from '@nestjs/config';

export const redisConfiguration = registerAs('redis', () => ({
  redisUrl: process.env.REDIS_URL,
}));
