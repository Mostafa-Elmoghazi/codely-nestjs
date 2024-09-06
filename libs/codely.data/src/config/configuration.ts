import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Configuration {
  constructor(private configService: ConfigService){}

  mongo(): { url: string } {
    return {
      url: this.configService.get<string>('MONGO.URL')
    };
  }

  pg(): {
    host: string,
    database: string,
    user: string,
    password: string,
    port: number
  } {
    return {
      host: this.configService.get<string>('PG_HOST'),
      database: this.configService.get<string>('PG_DATABASE'),
      user: this.configService.get<string>('PG_USER'),
      password: this.configService.get<string>('PG_PASSWORD'),
      port: this.configService.get<number>('PG_PORT')
    }
  }
}