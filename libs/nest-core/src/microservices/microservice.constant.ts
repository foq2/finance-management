import { Transport } from '@nestjs/microservices';
import { MicroserviceName } from '@repo/nest-common';

export const MS_INJECTION_TOKEN = (
  serviceName: MicroserviceName,
  transport: Transport,
) => `${serviceName}_${transport}_Client`;
