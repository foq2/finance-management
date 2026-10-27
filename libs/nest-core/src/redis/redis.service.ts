import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constant';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async set(key: string, value: any, ttlSeconds?: number) {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get<T = any>(key: string): Promise<T | any> {
    const data = await this.redis.get(key);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);

      if (typeof parsed !== 'object') {
        return data as unknown as T;
      }
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async delete(key: string): Promise<number> {
    return this.redis.del(key);
  }

  // Redis Key
  public getUserTokenKey(userId: string, jti: string) {
    return `user:${userId}:token:${jti}`;
  }

  public getUserPattern(userId: string) {
    return `user:${userId}:token`;
  }
}
