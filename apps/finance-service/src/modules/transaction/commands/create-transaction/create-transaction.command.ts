import { CreateTransactionBodyDto, TransactionEntryBodyDto } from '../../dto';

export class CreateTransactionCommand {
  public readonly date: Date;
  public readonly description: string;
  public readonly reference?: string;
  public readonly entries: TransactionEntryBodyDto[];

  constructor(
    public readonly userId: string,
    body: CreateTransactionBodyDto,
  ) {
    Object.assign(this, body);
  }
}
