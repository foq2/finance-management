import { TransactionEntryBodyDto, UpdateTransactionBodyDto } from '../../dto';

export class UpdateTransactionCommand {
  public readonly date?: Date;
  public readonly description?: string;
  public readonly reference?: string;
  public readonly entries?: TransactionEntryBodyDto[];

  constructor(
    public readonly userId: string,
    public readonly transactionId: string,
    body: UpdateTransactionBodyDto,
  ) {
    Object.assign(this, body);
  }
}
