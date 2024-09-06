import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Configuration {
  constructor(private configService: ConfigService){}

  app(): {
    frontendDomain: string,
    workingDirectory: string,
    appName: string
  } {
    return {
      frontendDomain: this.configService.get<string>('APP.FRONTEND_DOMAIN'),
      workingDirectory: process.env.PWD || process.cwd(),
      appName: this.configService.get<string>('APP.NAME')
    };
  }

  auth(): {
    AUTH_CONFIRM_EMAIL_SECRET: string,
    AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: string,
    AUTH_JWT_TOKEN_EXPIRES_IN: string,
    AUTH_JWT_SECRET: string,
    AUTH_REFRESH_SECRET: string,
    AUTH_REFRESH_TOKEN_EXPIRES_IN: string
  } {
    return {
      AUTH_CONFIRM_EMAIL_SECRET: this.configService.get<string>('AUTH_CONFIRM_EMAIL_SECRET'),
      AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: this.configService.get<string>('AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN'),
      AUTH_JWT_TOKEN_EXPIRES_IN: this.configService.get<string>('AUTH_JWT_TOKEN_EXPIRES_IN'),
      AUTH_JWT_SECRET: this.configService.get<string>('AUTH_JWT_SECRET'),
      AUTH_REFRESH_SECRET: this.configService.get<string>('AUTH_REFRESH_SECRET'),
      AUTH_REFRESH_TOKEN_EXPIRES_IN: this.configService.get<string>('AUTH_REFRESH_TOKEN_EXPIRES_IN')
    };
  }

  google(): {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  }{
    return {
      GOOGLE_CLIENT_ID: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      GOOGLE_CLIENT_SECRET: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
    }
  }

  apple(): {
    APPLE_APP_AUDIENCE: string;
  }{
    return {
      APPLE_APP_AUDIENCE: this.configService.get<string>('APPLE_APP_AUDIENCE')
    }
  }
}