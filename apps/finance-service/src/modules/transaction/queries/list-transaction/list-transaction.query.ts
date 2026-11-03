import { ListTransactionQueryDto } from '../../dto';

export class ListTransactionQuery {
  public readonly page: number;
  public readonly pageSize: number;
  public readonly accountId?: string;

  constructor(
    public readonly userId: string,
    query: ListTransactionQueryDto,
  ) {
    Object.assign(this, query);
  }
}
