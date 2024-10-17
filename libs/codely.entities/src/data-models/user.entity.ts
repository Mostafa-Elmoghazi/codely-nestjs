import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { ApiResponseProperty } from '@nestjs/swagger';
import { BaseDocument } from './base.document';

export class User extends BaseEntity {
  constructor() {
    super();
  }
  public firstName: string;
  public lastName: string;
  @Expose({ groups: ['me', 'admin'] })
  public email: string;
  @Exclude({ toPlainOnly: true })
  public password: string;
  public countryId: number;
  public city: string;
  @Expose({ groups: ['me', 'admin'] })
  public socialId: string;
  @Expose({ groups: ['me', 'admin'] })
  public provider: string;
  public photoUrl: string;
  public statusId: number;
  public bio: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
}
@Schema({
  collection: 'users',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchema extends BaseDocument {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @ApiResponseProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  @Prop({
    type: String,
    unique: true,
  })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Prop()
  password: string;

  @Prop({ required: false })
  countryId: number;

  @Prop({ required: false })
  city: string;

  @ApiResponseProperty({
    type: String,
    example: '1234567890',
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  socialId: string;

  @ApiResponseProperty({
    type: String,
    example: 'email',
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  @Prop({ required: true })
  provider: string;

  @Prop({ required: false })
  photoUrl: string;

  @Prop({ required: true })
  statusId: number;

  @Prop({ required: false })
  bio: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false })
  deletedAt: Date;
}
export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);
//UserSchemaFactory.index({ id: 1 }, { unique: true });
