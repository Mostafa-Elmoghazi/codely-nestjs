import { Injectable, ArgumentMetadata, Type } from '@nestjs/common';
import { CommandBus, ICommand } from '@nestjs/cqrs';
import { BusValidationPipe } from './validate-query.decorator';

@Injectable()
export class ValidationCommandBus extends CommandBus {
  private readonly validator = new BusValidationPipe();

  async execute<T extends ICommand, TResult>(command: T): Promise<TResult> {
    const metatype: Type<T> = command.constructor as Type<T>;
    const metadata: ArgumentMetadata = { metatype, type: 'query', data: '' };
    await this.validator.transform(command, metadata);
    return super.execute(command);
  }
}
