import { Module } from '@nestjs/common';
import { CodelyBusinessModule } from 'codely/codely.business/codely.business.module';
import { HeaderResolver, I18nModule, I18nService, I18nValidationExceptionFilter } from 'nestjs-i18n';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './auth/strategies/jwt-refresh.strategy';
import { AnonymousStrategy } from './auth/strategies/anonymous.strategy';
import { AuthController, UserController } from './api/controllers';

const controllers = [UserController, AuthController];

@Module({
  imports: [
    CodelyBusinessModule,
    // TypeOrmModule.forRootAsync({
    //   useClass: TypeOrmConfigService,
    //   dataSourceFactory: async (options: DataSourceOptions) => {
    //     return new DataSource(options).initialize();
    //   },
    // }),
    I18nModule.forRootAsync({
      useFactory: (c) => ({
        fallbackLanguage: 'en',
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        new HeaderResolver (['language']),
      ],
      imports: [],
      inject: []
    })
  ],
  controllers: [...controllers],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: (i18n: any) => new I18nValidationExceptionFilter(i18n),
      inject: [I18nService],
    },
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy
  ],
})
export class AppModule {
}
