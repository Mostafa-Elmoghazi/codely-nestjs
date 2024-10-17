import { Prop } from '@nestjs/mongoose';

export abstract class BaseEntity {
  constructor() {}
  //@Prop({})
  id: string;

  // Define a generic method to map from schema to entity
  static mapToEntity<T>(schema: any): T {
    const { _id, ...rest } = schema._doc; // Exclude _id if present
    return { ...rest, id: _id.toString() }; // Map id and the rest properties
  }

  // Define a generic method to map from entity to schema
  static mapToSchema<T>(entity: T): any {
    return {
      ...entity, // Spread the remaining properties
    };
  }
}
