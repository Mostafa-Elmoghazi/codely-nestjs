import { Injectable } from '@nestjs/common';
import { User, UserSchema } from 'codely/codely.entities/data-models';
import { BaseMongoRepository } from './base/base-mongo.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository extends BaseMongoRepository<User, UserSchema> {
  constructor(@InjectModel(UserSchema.name) userModel: Model<UserSchema>) {
    super(userModel, User.mapToEntity, User.mapToSchema);
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.schemaModel.findOne({ email }).exec();
    return user ? User.mapToEntity(user) : null;
  }

  async findBySocialIdAndProvider(
    socialId: string,
    provider: string,
  ): Promise<User | null> {
    const user =
      (await this.schemaModel.findOne({ socialId, provider })) || null;
    return user ? User.mapToEntity(user) : null;
  }
}
