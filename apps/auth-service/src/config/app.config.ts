import { registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => ({
  appPort: process.env.AUTH_SERVICE_PORT
    ? +process.env.AUTH_SERVICE_PORT
    : 3000,
  appName: process.env.AUTH_SERVICE_APP_NAME || 'Auth Service',
}));
