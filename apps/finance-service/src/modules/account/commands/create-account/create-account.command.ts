import { CreateAccountBodyDto } from '../../dto';
import { AccountType } from '../../../../data-access';

export class CreateAccountCommand {
  public readonly name: string;
  public readonly type: AccountType;
  public readonly description?: string;
  public readonly categoryId: string;

  constructor(
    public readonly userId: string,
    body: CreateAccountBodyDto,
  ) {
    Object.assign(this, body);
  }
}
