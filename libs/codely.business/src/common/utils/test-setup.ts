import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
// import { QuranCloudProxy } from 'codely/codely.business/api-proxies';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from '@app/core/caching';
import { ValidationQueryBus } from '../validation/validation-query-bus';
import { ValidationCommandBus } from '../validation/validation-command-bus';

export const createTestModule = async (
  customProviders: any[],
): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [
      CacheModule.register({
        ttl: 5,
        max: 100,
      }),
    ],
    providers: [
      // QuranCloudProxy,
      CacheService,
      QueryBus,
      CommandBus,
      {
        provide: QueryBus,
        useClass: ValidationQueryBus,
      },
      {
        provide: CommandBus,
        useClass: ValidationCommandBus,
      },
      ...customProviders,
    ],
  }).compile();
};
