import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountBalanceQuery } from './get-account-balance.query';
import {
  AccountRepository,
  AccountType,
  EntryType,
  TransactionEntryRepository,
} from '../../../../data-access';
import { AppException, ERROR_RESPONSE } from '@repo/nest-common';
import { AccountBalanceResponseDto } from '../../dto';
import { raw } from '@mikro-orm/postgresql';

// Account types whose normal balance is on the debit side.
const DEBIT_NORMAL_TYPES = new Set<string>([
  AccountType.ASSET,
  AccountType.EXPENSE,
]);

@QueryHandler(GetAccountBalanceQuery)
export class GetAccountBalanceHandler implements IQueryHandler<GetAccountBalanceQuery> {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly entryRepo: TransactionEntryRepository,
  ) {}

  async execute(
    query: GetAccountBalanceQuery,
  ): Promise<AccountBalanceResponseDto> {
    const account = await this.accountRepo.findOne({
      id: query.accountId,
      userId: query.userId,
    });
    if (!account) {
      throw new AppException(ERROR_RESPONSE.NOT_FOUND('Account'));
    }

    const rows = await this.entryRepo
      .createQueryBuilder('e')
      .select(['e.type', raw('sum(e.amount) as total')])
      .where({ account: account.id })
      .groupBy('e.type')
      .execute<{ type: string; total: string }[]>();

    let totalDebit = 0;
    let totalCredit = 0;
    for (const row of rows) {
      const amount = Number(row.total) || 0;
      if (row.type === EntryType.DEBIT) totalDebit += amount;
      else if (row.type === EntryType.CREDIT) totalCredit += amount;
    }

    const isDebitNormal = DEBIT_NORMAL_TYPES.has(account.type);
    const balance = isDebitNormal
      ? totalDebit - totalCredit
      : totalCredit - totalDebit;

    return {
      accountId: account.id,
      type: account.type as AccountType,
      totalDebit: totalDebit.toFixed(4),
      totalCredit: totalCredit.toFixed(4),
      balance: balance.toFixed(4),
    };
  }
}
