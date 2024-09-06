import { QueryBus } from '@nestjs/cqrs';
import { BusValidationPipe } from './validate-query.decorator';
import { IQuery } from '@nestjs/cqrs';
import { ArgumentMetadata, Injectable, Type } from '@nestjs/common';

@Injectable()
export class ValidationQueryBus extends QueryBus {
  private readonly validator = new BusValidationPipe();

  async execute<T extends IQuery, TResult>(query: T): Promise<TResult> {
    const metatype: Type<T> = query.constructor as Type<T>;
    const metadata: ArgumentMetadata = { metatype, type: 'query', data: '' };
    await this.validator.transform(query, metadata);
    return super.execute(query);
  }
}
