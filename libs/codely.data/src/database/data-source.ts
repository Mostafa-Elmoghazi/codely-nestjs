import { User } from 'codely/codely.entities/data-models';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

console.log("DIR ", __dirname)

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: false,
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: [User], //__dirname + '/../../libs/codely.entities/src/data-models/*.entity{.ts,.js}'
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'libs/codely.entities/src/data-models',
    subscribersDir: 'subscriber',
  },
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: process.env.PG_MAX_CONNECTIONS
      ? parseInt(process.env.PG_MAX_CONNECTIONS, 10)
      : 100,
    ssl:
      process.env.PG_SSL_ENABLED === 'true'
        ? {
            rejectUnauthorized: false,
            ca: undefined,
            key: undefined,
            cert: undefined,
          }
        : undefined,
  },
} as DataSourceOptions);
