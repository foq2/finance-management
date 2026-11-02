import { BaseSchema } from '@repo/nest-core';
import { TransactionEntryRepository } from './transaction-entry.repository';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Transaction } from '../transaction';
import { Account } from '../account';

export enum EntryType {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

const TransactionEntrySchema = defineEntity({
  name: 'TransactionEntry',
  tableName: 'transaction_entries',
  repository: () => TransactionEntryRepository,
  extends: BaseSchema,
  properties: {
    transaction: () =>
      p.manyToOne(Transaction).createForeignKeyConstraint(false),
    account: () => p.manyToOne(Account).createForeignKeyConstraint(false),
    type: p.string(),
    amount: p.decimal().precision(18).scale(4),
    description: p.string().nullable(),
  },
});

export class TransactionEntry extends TransactionEntrySchema.class {}
TransactionEntrySchema.setClass(TransactionEntry);
