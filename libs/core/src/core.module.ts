import { Module } from '@nestjs/common';
import { S3Service } from './file-store';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from './caching';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerService } from './mail';
import { Configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl: 5, // Cache TTL (Time To Live) in seconds
      max: 100, // Maximum number of items in cache
    }),
  ],
  providers: [S3Service, CacheService, MailerService, Configuration],
  exports: [S3Service, CacheService, MailerService],
})
export class CoreModule {}
