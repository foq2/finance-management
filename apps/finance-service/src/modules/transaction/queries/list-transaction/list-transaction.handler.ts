import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListTransactionQuery } from './list-transaction.query';
import { TransactionRepository } from '../../../../data-access';
import { PaginationResponseDto } from '@repo/nest-common';
import { ListTransactionResponseDto } from '../../dto';
import { toTransactionResponse } from '../../transaction.util';

@QueryHandler(ListTransactionQuery)
export class ListTransactionHandler implements IQueryHandler<ListTransactionQuery> {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute(
    query: ListTransactionQuery,
  ): Promise<PaginationResponseDto<ListTransactionResponseDto>> {
    const qb = this.transactionRepo
      .createQueryBuilder('t')
      .where({ userId: query.userId })
      .orderBy({ date: 'desc', createdAt: 'desc' });

    if (query.accountId) {
      qb.andWhere({ entries: { account: query.accountId } });
    }

    const result = await this.transactionRepo.paginate(
      qb,
      query.page,
      query.pageSize,
    );

    return {
      data: result.data.map(toTransactionResponse),
      pagination: result.pagination,
    };
  }
}
