import { Injectable } from '@nestjs/common';
import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';

@Injectable()
export class PGBaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(entity: DeepPartial<T>): Promise<T> {
    return await this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findOne(conditions: FindOptionsWhere<T>): Promise<T | undefined> {
    return await this.repository.findOneBy(conditions);
  }

  async findMany(conditions: FindOptionsWhere<T>): Promise<T[] | undefined> {
    return await this.repository.findBy(conditions);
  }

  async update(id: string, entity: DeepPartial<T>): Promise<void> {
    await this.repository.update(id, entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
