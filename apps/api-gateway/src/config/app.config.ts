import { registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => ({
  appPort: process.env.API_GATEWAY_PORT ? +process.env.API_GATEWAY_PORT : 3000,
}));
