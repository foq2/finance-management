import { registerAs } from '@nestjs/config';
import { MicroserviceName } from '../enums';

export const tcpConfiguration = registerAs('tcp', () => ({
  [MicroserviceName.UserService]: {
    host: '0.0.0.0',
    port: 1234,
  },
}));
