import { Model } from 'mongoose';
//import { BaseMongoRepositoryInterface } from './interfaces/base-mongo-repository.interface';
import { InjectModel } from '@nestjs/mongoose';

export interface BaseMongoRepositoryInterface<TEntity> {
  create(entity: TEntity): Promise<TEntity>;
  findById(id: string): Promise<TEntity | null>;
  findAll(): Promise<TEntity[]>;
  update(id: string, entity: Partial<TEntity>): Promise<TEntity | null>;
  delete(id: string): Promise<void>;
}

export abstract class BaseMongoRepository<TEntity, TSchema>
  implements BaseMongoRepositoryInterface<TEntity>
{
  constructor(
    @InjectModel('SchemaName') private readonly schemaModel: Model<TSchema>,
    private readonly mapToEntity: (schema: TSchema) => TEntity,
    private readonly mapToSchema: (entity: TEntity) => TSchema,
  ) {}

  async create(entity: TEntity): Promise<TEntity> {
    const schemaInstance = new this.schemaModel(this.mapToSchema(entity));
    const savedSchema = await schemaInstance.save();
    return this.mapToEntity(savedSchema.toObject() as TSchema);
  }

  async findById(id: string): Promise<TEntity | null> {
    const schema = await this.schemaModel.findById(id).exec();
    return schema ? this.mapToEntity(schema) : null;
  }

  async findAll(): Promise<TEntity[]> {
    const schemas = await this.schemaModel.find().exec();
    return schemas.map(this.mapToEntity);
  }

  async update(id: string, entity: Partial<TEntity>): Promise<TEntity | null> {
    const updatedSchema = await this.schemaModel
      .findByIdAndUpdate(id, this.mapToSchema(entity as TEntity), { new: true })
      .exec();
    return updatedSchema ? this.mapToEntity(updatedSchema) : null;
  }

  async delete(id: string): Promise<void> {
    await this.schemaModel.findByIdAndDelete(id).exec();
  }
}
