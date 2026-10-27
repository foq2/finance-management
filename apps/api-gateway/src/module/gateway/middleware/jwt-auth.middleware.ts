import { Inject, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import {
  AppException,
  ERROR_RESPONSE,
  jwtConfiguration,
} from '@repo/nest-common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@repo/nest-core';

export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new AppException(ERROR_RESPONSE.UNAUTHORIZED);
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfig.secret,
      });

      // check redis
      const { userId, jti } = decoded;
      const userTokenKey = this.redisService.getUserTokenKey(userId, jti);

      delete req.headers['x-user-data'];
      req.headers['x-user-data'] = Buffer.from(
        JSON.stringify(decoded),
      ).toString('base64');

      next();
    } catch {
      throw new AppException(ERROR_RESPONSE.UNAUTHORIZED);
    }
  }
}
