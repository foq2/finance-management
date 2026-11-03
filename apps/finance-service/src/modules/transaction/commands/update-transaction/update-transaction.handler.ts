import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from './update-transaction.command';
import { UpdateTransactionResponseDto } from '../../dto';
import {
  AccountRepository,
  TransactionEntry,
  TransactionRepository,
} from '../../../../data-access';
import { EntityManager } from '@mikro-orm/postgresql';
import { AppException, ERROR_RESPONSE } from '@repo/nest-common';
import {
  assertBalancedEntries,
  toTransactionDetailResponse,
} from '../../transaction.util';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler implements ICommandHandler<UpdateTransactionCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly transactionRepo: TransactionRepository,
    private readonly accountRepo: AccountRepository,
  ) {}

  async execute(
    command: UpdateTransactionCommand,
  ): Promise<UpdateTransactionResponseDto> {
    const transaction = await this.transactionRepo.findOne(
      { id: command.transactionId, userId: command.userId },
      { populate: ['entries'] },
    );
    if (!transaction) {
      throw new AppException(ERROR_RESPONSE.NOT_FOUND('Transaction'));
    }

    if (command.date !== undefined) transaction.date = command.date;
    if (command.description !== undefined)
      transaction.description = command.description;
    if (command.reference !== undefined)
      transaction.reference = command.reference;

    if (command.entries !== undefined) {
      assertBalancedEntries(command.entries);
      await this.ensureAccountsOwned(command);

      // Replace the full entry set to keep the ledger balanced.
      transaction.entries.removeAll();
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
    }

    await this.em.flush();

    return toTransactionDetailResponse(transaction);
  }

  private async ensureAccountsOwned(
    command: UpdateTransactionCommand,
  ): Promise<void> {
    const accountIds = [
      ...new Set((command.entries ?? []).map((e) => e.accountId)),
    ];
    const count = await this.accountRepo.count({
      id: { $in: accountIds },
      userId: command.userId,
    });
    if (count !== accountIds.length) {
      throw new AppException(ERROR_RESPONSE.NOT_FOUND('Account'));
    }
  }
}
