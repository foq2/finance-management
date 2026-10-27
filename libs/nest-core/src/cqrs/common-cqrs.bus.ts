import { Injectable } from '@nestjs/common';
import { CommandBus, ICommand, IQuery, QueryBus } from '@nestjs/cqrs';
import { EntityManager, RequestContext } from '@mikro-orm/postgresql';

@Injectable()
export class CommonCqrsBus {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly em: EntityManager,
  ) {}

  async executeCommand<T extends ICommand = ICommand, R = any>(
    command: T,
  ): Promise<R> {
    return RequestContext.create(this.em, () =>
      this.commandBus.execute(command),
    );
  }

  async executeQuery<T extends IQuery = IQuery, R = any>(query: T): Promise<R> {
    return RequestContext.create(this.em, () => this.queryBus.execute(query));
  }
}
