import { Injectable } from '@nestjs/common';
import { CommandBus, ICommand, IQuery, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class Mediator {
  constructor(
    private qBus: QueryBus,
    private cmdBus: CommandBus,
  ) {}

  public async query(q: IQuery) {
    return await this.qBus.execute(q);
  }

  public async command(cmd: ICommand) {
    return await this.cmdBus.execute(cmd);
  }
}
