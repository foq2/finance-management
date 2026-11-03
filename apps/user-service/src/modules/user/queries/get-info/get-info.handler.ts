import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInfoQuery } from './get-info.query';
import { UserRepository } from '../../../../data-access';
import { GetInfoResponseDto } from '../../dto';
import { toDto } from '@repo/nest-common';

@QueryHandler(GetInfoQuery)
export class GetInfoHandler implements IQueryHandler<GetInfoQuery> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(query: GetInfoQuery): Promise<GetInfoResponseDto> {
    const user = await this.userRepo.findOneOrFail(query.userId);

    return toDto(GetInfoResponseDto, user);
  }
}
