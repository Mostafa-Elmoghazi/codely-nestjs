import { Module } from '@nestjs/common';
import { FileSystemService, S3Service } from './file-store';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from './caching';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerService } from './mail';
import { Configuration } from './config/configuration';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl: 5, // Cache TTL (Time To Live) in seconds
      max: 100, // Maximum number of items in cache
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [
    S3Service,
    FileSystemService,
    CacheService,
    MailerService,
    Configuration,
  ],
  exports: [S3Service, FileSystemService, CacheService, MailerService],
})
export class CoreModule {}
