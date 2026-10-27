import { Global, Module } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constant';
import {
  CommonLogger,
  LoggerModule,
  redisConfiguration,
} from '@repo/nest-common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfiguration), LoggerModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [redisConfiguration.KEY, CommonLogger],
      useFactory: async (
        redisConfig: ConfigType<typeof redisConfiguration>,
        logger: CommonLogger,
      ) => {
        const { redisUrl } = redisConfig;

        const redisClient = new Redis(redisUrl, {
          retryStrategy: () => null,
          maxRetriesPerRequest: null,
        });

        redisClient.on('error', (err) => {
          logger.error(err.message, { context: 'RedisClient' });
        });

        redisClient.on('connect', () => {
          logger.log('Redis client connected', { context: 'RedisClient' });
        });

        // health check
        try {
          await redisClient.ping();
        } catch (err) {
          throw new Error(err.message);
        }

        return redisClient;
      },
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
