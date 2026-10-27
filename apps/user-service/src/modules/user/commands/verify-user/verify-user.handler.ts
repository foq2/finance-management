import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyUserCommand } from './verify-user.command';
import { UserRepository } from '../../../../data-access';
import {
  AppException,
  ERROR_RESPONSE,
  VerifyUserResponseDto,
} from '@repo/nest-common';
import { verifyHashed } from '../../user.util';
import { plainToInstance } from 'class-transformer';

@CommandHandler(VerifyUserCommand)
export class VerifyUserHandler implements ICommandHandler<VerifyUserCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: VerifyUserCommand): Promise<VerifyUserResponseDto> {
    const user = await this.userRepo.findOne({ username: command.username });
    if (!user?.password)
      throw new AppException(ERROR_RESPONSE.INVALID_CREDENTIALS);

    const isPasswordValid = await verifyHashed(command.password, user.password);
    if (!isPasswordValid)
      throw new AppException(ERROR_RESPONSE.INVALID_CREDENTIALS);

    // return token payload data
    return plainToInstance(
      VerifyUserResponseDto,
      { ...user, userId: user.id },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
