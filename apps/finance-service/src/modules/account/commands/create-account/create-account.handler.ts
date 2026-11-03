import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from './create-account.command';
import { CreateAccountResponseDto } from '../../dto';
import { AccountRepository, CategoryRepository } from '../../../../data-access';
import { EntityManager } from '@mikro-orm/postgresql';
import { AppException, ERROR_RESPONSE } from '@repo/nest-common';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly accountRepo: AccountRepository,
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async execute(
    command: CreateAccountCommand,
  ): Promise<CreateAccountResponseDto> {
    const category = await this.categoryRepo.findOne({
      id: command.categoryId,
      userId: command.userId,
    });
    if (!category) {
      throw new AppException(ERROR_RESPONSE.NOT_FOUND('Category'));
    }

    const account = this.accountRepo.create({
      userId: command.userId,
      name: command.name,
      type: command.type,
      description: command.description ?? null,
      category: category.id,
    });

    await this.em.persist(account).flush();

    return { id: account.id };
  }
}
