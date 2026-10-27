import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway';
import { ConfigModule } from '@nestjs/config';
import {
  AllExceptionFilter,
  appCommonConfiguration,
  jwtConfiguration,
  LoggerModule,
  microserviceConfiguration,
  validate,
} from '@repo/nest-common';
import { appConfiguration } from '../config';
import { RedisModule } from '@repo/nest-core';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    GatewayModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
      // for joi
      // validationOptions: {
      //   abortEarly: false,
      // }
      load: [
        appCommonConfiguration,
        appConfiguration,
        microserviceConfiguration,
        jwtConfiguration,
      ],
    }),
    LoggerModule,
    GatewayModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
  ],
})
export class AppModule {}
