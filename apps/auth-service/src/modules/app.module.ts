import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { ConfigModule, ConfigType } from '@nestjs/config';
import {
  AllExceptionFilter,
  appCommonConfiguration,
  AppGuard,
  LoggerModule,
  microserviceConfiguration,
  MicroserviceName,
  tcpConfiguration,
  validate,
} from '@repo/nest-common';
import { appConfiguration } from '../config';
import { MicroserviceModule, RedisModule } from '@repo/nest-core';
import { Transport } from '@nestjs/microservices';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
      // validationOptions: { abortEarly: false },
      load: [
        appCommonConfiguration,
        appConfiguration,
        tcpConfiguration,
        microserviceConfiguration,
      ],
    }),
    LoggerModule,
    MicroserviceModule.registerAsync([
      {
        name: MicroserviceName.UserService,
        transport: Transport.TCP,
        useFactory: (config: ConfigType<typeof tcpConfiguration>) => {
          return config[MicroserviceName.UserService];
        },
        inject: [tcpConfiguration.KEY],
      },
    ]),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_GUARD, useClass: AppGuard },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
