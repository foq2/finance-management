import { UpdateAccountBodyDto } from '../../dto';
import { AccountType } from '../../../../data-access';

export class UpdateAccountCommand {
  public readonly name?: string;
  public readonly type?: AccountType;
  public readonly description?: string;
  public readonly categoryId?: string;

  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    body: UpdateAccountBodyDto,
  ) {
    Object.assign(this, body);
  }
}
