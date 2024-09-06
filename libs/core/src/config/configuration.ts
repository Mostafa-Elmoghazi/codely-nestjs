import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Configuration {
  constructor(private configService: ConfigService){}

  mail(): {
    host: string,
    defaultName: string,
    defaultEmail: string,
    ignoreTls: boolean,
    requireTls: boolean,
    secure: boolean,
    user: string,
    password: string,
    port: number
  } {
    return {
      host: this.configService.get<string>('MAIL.HOST'),
      defaultName: this.configService.get<string>('MAIL.DEFAULT_NAME'),
      defaultEmail: this.configService.get<string>('MAIL.DEFAULT_EMAIL'),
      ignoreTls: this.configService.get<boolean>('MAIL.DEFAULT_EMAIL'),
      requireTls: this.configService.get<boolean>('MAIL.REQUIRE_TLS'),
      secure: this.configService.get<boolean>('MAIL.SECURE'),
      user: this.configService.get<string>('MAIL.USER'),
      password: this.configService.get<string>('MAIL.PASSWORD'),
      port: this.configService.get<number>('MAIL.PORT')
    }
  }
}