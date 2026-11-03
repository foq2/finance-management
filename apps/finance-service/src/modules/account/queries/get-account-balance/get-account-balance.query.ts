export class GetAccountBalanceQuery {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
  ) {}
}
