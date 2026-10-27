import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../modules/user';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../mikro-orm.config';
import { CommonCqrsModule } from '@repo/nest-core';
import { CreateAdminCommand } from './commands';
import { CreateAdminQuestions } from './questions';

@Module({
  imports: [
    ConfigModule.forRoot({
      // validate,
      cache: true,
      // load: [],
    }),
    MikroOrmModule.forRoot(config),
    CommonCqrsModule,
    UserModule,
  ],
  providers: [CreateAdminCommand, CreateAdminQuestions],
})
export class CliModule {}
