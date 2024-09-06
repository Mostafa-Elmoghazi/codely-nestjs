import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from 'codely/codely.entities/data-models';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {
    console.log("ServDIR", __dirname)
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('PG_HOST', { infer: true }),
      port: this.configService.get('PG_PORT', { infer: true }),
      username: this.configService.get('PG_USER', { infer: true }),
      password: this.configService.get('PG_PASSWORD', { infer: true }),
      database: this.configService.get('PG_DATABASE', { infer: true }),
      synchronize: false,
      dropSchema: false,
      keepConnectionAlive: true,
      logging:
        this.configService.get('NODE_ENV', { infer: true }) !== 'production',
      entities: [User], //__dirname + '/../../libs/codely.entities/src/data-models/*.entity{.ts,.js}'
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'libs/codely.entities/src/data-models',
        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('PG_MAX_CONNECTIONS', { infer: true }),
        // ssl: this.configService.get('PG_SSL_ENABLED', { infer: true })
        //   ? {
        //       rejectUnauthorized: false,
        //       ca: undefined,
        //       key: undefined,
        //       cert: undefined,
        //     }
        //   : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
