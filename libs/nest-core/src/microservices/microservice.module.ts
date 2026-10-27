import {
  DynamicModule,
  FactoryProvider,
  Module,
  Provider,
} from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { MS_INJECTION_TOKEN } from './microservice.constant';
import { MicroserviceClient } from './microservice.interface';

@Module({})
export class MicroserviceModule {
  static registerAsync(clients: MicroserviceClient[]): DynamicModule {
    const asyncProviders: Provider[] = clients.map((client) => ({
      provide: `${client.name}_${client.transport}_ASYNC_CONFIG`,
      useFactory: client.useFactory,
      inject: client.inject || [],
    }));

    const clientProviders: FactoryProvider[] = clients.map((client) => {
      const uniqueProvideToken = MS_INJECTION_TOKEN(
        client.name,
        client.transport,
      );
      const asyncConfigToken = `${client.name}_${client.transport}_ASYNC_CONFIG`;

      return {
        provide: uniqueProvideToken,
        useFactory: (resolvedOptions: any) => {
          const clientOption = {
            transport: client.transport,
            options: resolvedOptions,
          };

          return ClientProxyFactory.create(clientOption);
        },
        inject: [asyncConfigToken],
      };
    });

    return {
      global: true,
      module: MicroserviceModule,
      imports: [],
      exports: clientProviders.map((p) => p.provide),
      providers: [...asyncProviders, ...clientProviders],
    };
  }
}
