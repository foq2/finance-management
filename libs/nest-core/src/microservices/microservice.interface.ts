import { MicroserviceName } from '@repo/nest-common';
import { Transport } from '@nestjs/microservices';

export interface MicroserviceClient {
  name: MicroserviceName;
  transport: Transport;
  useFactory: any;
  inject: any;
}
