import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { CreateUserResponseDto } from '../../dto';
import { UserRepository } from '../../../../data-access';
import { EntityManager } from '@mikro-orm/postgresql';
import { AppException, ERROR_RESPONSE } from '@repo/nest-common';
import { hashData } from '../../user.util';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
  ) {}
  async execute(command: CreateUserCommand): Promise<CreateUserResponseDto> {
    const existingUser = await this.userRepo.findOne({
      username: command.username,
    });
    if (existingUser) {
      throw new AppException(ERROR_RESPONSE.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await hashData(command.password);
    const user = this.userRepo.create({ ...command, password: hashedPassword });

    await this.em.persist(user).flush();

    return { id: user.id };
  }
}
