import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionQuery } from './get-transaction.query';
import { TransactionRepository } from '../../../../data-access';
import { AppException, ERROR_RESPONSE } from '@repo/nest-common';
import { GetTransactionResponseDto } from '../../dto';
import { toTransactionDetailResponse } from '../../transaction.util';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler implements IQueryHandler<GetTransactionQuery> {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute(
    query: GetTransactionQuery,
  ): Promise<GetTransactionResponseDto> {
    const transaction = await this.transactionRepo.findOne(
      { id: query.transactionId, userId: query.userId },
      { populate: ['entries'] },
    );
    if (!transaction) {
      throw new AppException(ERROR_RESPONSE.NOT_FOUND('Transaction'));
    }

    return toTransactionDetailResponse(transaction);
  }
}
