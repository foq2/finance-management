import { registerAs } from '@nestjs/config';
import { Algorithm } from 'jsonwebtoken';

export const jwtConfiguration = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  algorithm: (process.env.JWT_ALGORITHM || 'HS256') as Algorithm,
  accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES || '1d',
  refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES || '1d',
}));
