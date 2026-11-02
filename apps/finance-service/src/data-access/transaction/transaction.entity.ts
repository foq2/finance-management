import { BaseSchema } from '@repo/nest-core';
import { TransactionRepository } from './transaction.repository';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { TransactionEntry } from '../transaction-entry';

export const TransactionSchema = defineEntity({
  name: 'Transaction',
  tableName: 'transactions',
  repository: () => TransactionRepository,
  extends: BaseSchema,
  properties: {
    userId: p.string(),
    date: p.datetime(),
    description: p.string(),
    reference: p.string().nullable(),
    entries: () => p.oneToMany(TransactionEntry).mappedBy('transaction'),
  },
});

export class Transaction extends TransactionSchema.class {}
TransactionSchema.setClass(Transaction);
