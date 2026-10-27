import { registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => ({
  appPort: process.env.USER_SERVICE_PORT
    ? +process.env.USER_SERVICE_PORT
    : 3000,
  appName: process.env.USER_SERVICE_APP_NAME || 'User Service',
}));
