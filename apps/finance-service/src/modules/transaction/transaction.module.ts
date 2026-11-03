import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Account, Transaction, TransactionEntry } from '../../data-access';
import { TransactionController } from './transaction.controller';
import {
  CreateTransactionHandler,
  UpdateTransactionHandler,
  DeleteTransactionHandler,
} from './commands';
import { GetTransactionHandler, ListTransactionHandler } from './queries';

@Module({
  imports: [
    MikroOrmModule.forFeature([Transaction, TransactionEntry, Account]),
  ],
  controllers: [TransactionController],
  providers: [
    CreateTransactionHandler,
    UpdateTransactionHandler,
    DeleteTransactionHandler,
    ListTransactionHandler,
    GetTransactionHandler,
  ],
})
export class TransactionModule {}
