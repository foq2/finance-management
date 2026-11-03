import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './create-transaction.command';
import { CreateTransactionResponseDto } from '../../dto';
import {
  AccountRepository,
  TransactionEntry,
  TransactionRepository,
} from '../../../../data-access';
import { EntityManager } from '@mikro-orm/postgresql';
import { AppException, ERROR_RESPONSE } from '@repo/nest-common';
import { assertBalancedEntries } from '../../transaction.util';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly transactionRepo: TransactionRepository,
    private readonly accountRepo: AccountRepository,
  ) {}

  async execute(
    command: CreateTransactionCommand,
  ): Promise<CreateTransactionResponseDto> {
    assertBalancedEntries(command.entries);

    await this.ensureAccountsOwned(command);

    const transaction = this.transactionRepo.create({
      userId: command.userId,
      date: command.date,
      description: command.description,
      reference: command.reference ?? null,
    });

    for (const entry of command.entries) {
      transaction.entries.add(
        this.em.create(TransactionEntry, {
          transaction,
          account: entry.accountId,
          type: entry.type,
          amount: String(entry.amount),
          description: entry.description ?? null,
        }),
      );
    }

    await this.em.persist(transaction).flush();

    return { id: transaction.id };
  }

  private async ensureAccountsOwned(
    command: CreateTransactionCommand,
  ): Promise<void> {
    const accountIds = [...new Set(command.entries.map((e) => e.accountId))];
    const count = await this.accountRepo.count({
      id: { $in: accountIds },
      userId: command.userId,
    });
    if (count !== accountIds.length) {
      throw new AppException(ERROR_RESPONSE.NOT_FOUND('Account'));
    }
  }
}
