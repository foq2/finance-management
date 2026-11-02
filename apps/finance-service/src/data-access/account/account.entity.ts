import { BaseSchema } from '@repo/nest-core';
import { AccountRepository } from './account.repository';
import { defineEntity, p } from '@mikro-orm/postgresql';
import { Category } from '../category';

export enum AccountType {
  ASSET = 'asset',
  LIABILITY = 'liability',
  EQUITY = 'equity',
  INCOME = 'income',
  EXPENSE = 'expense',
}

const AccountSchema = defineEntity({
  name: 'Account',
  tableName: 'accounts',
  repository: () => AccountRepository,
  extends: BaseSchema,
  properties: {
    userId: p.string(),
    name: p.string(),
    type: p.string(),
    description: p.string().nullable(),
    category: () => p.manyToOne(Category).createForeignKeyConstraint(false),
  },
});

export class Account extends AccountSchema.class {}
AccountSchema.setClass(Account);
