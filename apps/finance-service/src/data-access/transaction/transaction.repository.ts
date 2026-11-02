import { BaseRepository } from '@repo/nest-core';
import { Transaction } from './transaction.entity';

export class TransactionRepository extends BaseRepository<Transaction> {}
