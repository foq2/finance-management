import { Module } from '@nestjs/common';
import { UserModule } from '../modules/user';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CommonCqrsModule } from '@repo/nest-core';
import { CreateAdminCommand } from './commands';
import { CreateAdminQuestions } from './questions';
import mikroOrmConfig from '../mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    CommonCqrsModule,
    UserModule,
  ],
  providers: [CreateAdminCommand, CreateAdminQuestions],
})
export class CliModule {}
