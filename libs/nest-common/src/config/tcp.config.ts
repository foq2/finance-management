import { registerAs } from '@nestjs/config';
import { MicroserviceName } from '../enums';

export const tcpConfiguration = registerAs('tcp', () => ({
  [MicroserviceName.UserService]: {
    host: process.env.USER_SERVICE_TCP_HOST,
    port: +process.env.USER_SERVICE_TCP_PORT,
  },
  [MicroserviceName.FinanceService]: {
    host: process.env.FINANCE_SERVICE_TCP_HOST,
    port: +process.env.FINANCE_SERVICE_TCP_PORT,
  },
}));
