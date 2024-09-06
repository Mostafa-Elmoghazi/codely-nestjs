import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Quiz {
  constructor(
    public id: string,
    public quizMethodId: number,
    public quizTypeId: number,
  ) {}
}

@Schema({
  collection: 'quizzes',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QuizSchema extends Document {
  @Prop({ required: true })
  quizMethodId: number;

  @Prop({ required: true })
  quizTypeId: number;
}

export const QuizSchemaFactory = SchemaFactory.createForClass(QuizSchema);
