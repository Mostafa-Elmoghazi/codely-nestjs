// libs/data/src/repositories/quiz.repository.ts

import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from './base/base-mongo.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from 'codely/codely.entities/data-models';
import { Model } from 'mongoose';

@Injectable()
export class QuizRepository extends BaseMongoRepository<Quiz, QuizSchema> {
  constructor(@InjectModel(QuizSchema.name) quizModel: Model<QuizSchema>) {
    super(quizModel, QuizRepository.mapToEntity, QuizRepository.mapToSchema);
  }

  private static mapToEntity(schema: QuizSchema): Quiz {
    return new Quiz(schema.id, schema.quizMethodId, schema.quizTypeId);
  }

  private static mapToSchema(entity: Quiz): QuizSchema {
    return {
      id: entity.id,
      quizMethodId: entity.quizMethodId,
      quizTypeId: entity.quizTypeId,
    } as any;
  }
}
