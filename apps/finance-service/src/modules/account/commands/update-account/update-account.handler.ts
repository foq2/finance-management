import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAccountCommand } from './update-account.command';
import { UpdateAccountResponseDto } from '../../dto';
import { AccountRepository, CategoryRepository } from '../../../../data-access';
import { EntityManager } from '@mikro-orm/postgresql';
import { AppException, ERROR_RESPONSE, toDto } from '@repo/nest-common';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountHandler implements ICommandHandler<UpdateAccountCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly accountRepo: AccountRepository,
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async execute(
    command: UpdateAccountCommand,
  ): Promise<UpdateAccountResponseDto> {
    const account = await this.accountRepo.findOne({
      id: command.accountId,
      userId: command.userId,
    });
    if (!account) {
      throw new AppException(ERROR_RESPONSE.NOT_FOUND('Account'));
    }

    if (command.categoryId && command.categoryId !== account.category?.id) {
      const category = await this.categoryRepo.findOne({
        id: command.categoryId,
        userId: command.userId,
      });
      if (!category) {
        throw new AppException(ERROR_RESPONSE.NOT_FOUND('Category'));
      }
      account.category = category;
    }

    if (command.name !== undefined) account.name = command.name;
    if (command.type !== undefined) account.type = command.type;
    if (command.description !== undefined)
      account.description = command.description;

    await this.em.flush();

    return toDto(UpdateAccountResponseDto, {
      ...account,
      categoryId: account.category?.id,
    });
  }
}
