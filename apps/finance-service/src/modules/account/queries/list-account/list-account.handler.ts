import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListAccountQuery } from './list-account.query';
import { AccountRepository } from '../../../../data-access';
import { PaginationResponseDto, toDto } from '@repo/nest-common';
import { ListAccountResponseDto } from '../../dto';

@QueryHandler(ListAccountQuery)
export class ListAccountHandler implements IQueryHandler<ListAccountQuery> {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(
    query: ListAccountQuery,
  ): Promise<PaginationResponseDto<ListAccountResponseDto>> {
    const qb = this.accountRepo
      .createQueryBuilder('a')
      .where({ userId: query.userId })
      .orderBy({ createdAt: 'desc' });

    if (query.type) qb.andWhere({ type: query.type });

    const result = await this.accountRepo.paginate(
      qb,
      query.page,
      query.pageSize,
    );

    return {
      data: result.data.map((account) =>
        toDto(ListAccountResponseDto, {
          ...account,
          categoryId: account.category?.id,
        }),
      ),
      pagination: result.pagination,
    };
  }
}
