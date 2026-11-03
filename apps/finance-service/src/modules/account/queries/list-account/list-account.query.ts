import { ListAccountQueryDto } from '../../dto';
import { AccountType } from '../../../../data-access';

export class ListAccountQuery {
  public readonly page: number;
  public readonly pageSize: number;
  public readonly type?: AccountType;

  constructor(
    public readonly userId: string,
    query: ListAccountQueryDto,
  ) {
    Object.assign(this, query);
  }
}
