import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountQuery } from './get-account.query';
import { AccountRepository } from '../../../../data-access';
import { AppException, ERROR_RESPONSE, toDto } from '@repo/nest-common';
import { GetAccountResponseDto } from '../../dto';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler implements IQueryHandler<GetAccountQuery> {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(query: GetAccountQuery): Promise<GetAccountResponseDto> {
    const account = await this.accountRepo.findOne({
      id: query.accountId,
      userId: query.userId,
    });
    if (!account) {
      throw new AppException(ERROR_RESPONSE.NOT_FOUND('Account'));
    }

    return toDto(GetAccountResponseDto, {
      ...account,
      categoryId: account.category?.id,
    });
  }
}
