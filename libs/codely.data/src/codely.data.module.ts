import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  QuizSchema,
  QuizSchemaFactory,
} from 'codely/codely.entities/data-models';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizRepository } from './repositories/quiz.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';

const repositories = [UserRepository, QuizRepository];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO.URL'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get<string>('PG_HOST'),
    //     port: configService.get<number>('PG_PORT'),
    //     username: configService.get<string>('PG_USER'),
    //     password: configService.get<string>('PG_PASSWORD'),
    //     database: configService.get<string>('PG_DATABASE'),
    //     entities: [User],
    //     synchronize: false
    //   }),
    // }),
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([
      { name: QuizSchema.name, schema: QuizSchemaFactory },
    ]),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class CodelyDataModule {
}
