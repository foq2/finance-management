import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTransactionCommand } from './delete-transaction.command';
import { TransactionRepository } from '../../../../data-access';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  AppException,
  ERROR_RESPONSE,
  SuccessResponseDto,
} from '@repo/nest-common';

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler implements ICommandHandler<DeleteTransactionCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly transactionRepo: TransactionRepository,
  ) {}

  async execute(
    command: DeleteTransactionCommand,
  ): Promise<SuccessResponseDto> {
    const transaction = await this.transactionRepo.findOne(
      { id: command.transactionId, userId: command.userId },
      { populate: ['entries'] },
    );
    if (!transaction) {
      throw new AppException(ERROR_RESPONSE.NOT_FOUND('Transaction'));
    }

    const now = new Date();
    transaction.deletedAt = now;
    for (const entry of transaction.entries.getItems()) {
      entry.deletedAt = now;
    }

    await this.em.flush();

    return { success: true };
  }
}
