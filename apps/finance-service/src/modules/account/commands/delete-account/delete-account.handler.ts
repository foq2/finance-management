import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAccountCommand } from './delete-account.command';
import { AccountRepository } from '../../../../data-access';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  AppException,
  ERROR_RESPONSE,
  SuccessResponseDto,
} from '@repo/nest-common';

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountHandler implements ICommandHandler<DeleteAccountCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly accountRepo: AccountRepository,
  ) {}

  async execute(command: DeleteAccountCommand): Promise<SuccessResponseDto> {
    const account = await this.accountRepo.findOne({
      id: command.accountId,
      userId: command.userId,
    });
    if (!account) {
      throw new AppException(ERROR_RESPONSE.NOT_FOUND('Account'));
    }

    account.deletedAt = new Date();
    await this.em.flush();

    return { success: true };
  }
}
