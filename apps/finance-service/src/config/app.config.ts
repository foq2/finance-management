import { registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => ({
  appPort: process.env.FINANCE_SERVICE_PORT
    ? +process.env.FINANCE_SERVICE_PORT
    : 3000,
  appName: process.env.FINANCE_SERVICE_APP_NAME || 'Finance Service',
}));
