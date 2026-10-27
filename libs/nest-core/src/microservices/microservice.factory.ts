import { Transport } from '@nestjs/microservices';
import { MicroserviceName } from '@repo/nest-common';
import { ConfigService } from '@nestjs/config';

// decided to not use this anymore
export class MicroserviceFactory {
  constructor(private readonly configService: ConfigService) {}

  private createTCPConfig(name: MicroserviceName): any {
    return {
      transport: Transport.TCP,
      name,
      options: this.configService.get(`tcp.${name}`),
    };
  }

  public createConfig(transport: Transport, name: MicroserviceName): any {
    switch (transport) {
      case Transport.TCP:
        return this.createTCPConfig(name);

      default:
        throw new Error(`MicroserviceFactory: Unsupported transport type`);
    }
  }
}
