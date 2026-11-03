import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Account, Category, TransactionEntry } from '../../data-access';
import { AccountController } from './account.controller';
import {
  CreateAccountHandler,
  UpdateAccountHandler,
  DeleteAccountHandler,
} from './commands';
import {
  GetAccountBalanceHandler,
  GetAccountHandler,
  ListAccountHandler,
} from './queries';

@Module({
  imports: [MikroOrmModule.forFeature([Account, Category, TransactionEntry])],
  controllers: [AccountController],
  providers: [
    CreateAccountHandler,
    UpdateAccountHandler,
    DeleteAccountHandler,
    ListAccountHandler,
    GetAccountHandler,
    GetAccountBalanceHandler,
  ],
})
export class AccountModule {}
