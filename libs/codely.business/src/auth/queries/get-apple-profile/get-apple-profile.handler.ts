import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import appleSigninAuth from 'apple-signin-auth';
import { Configuration } from 'codely/codely.business/common';
import { GetAppleLoginQuery } from './get-apple-profile.query';
import { SocialInterface } from 'codely/codely.entities/dtos';

@Injectable()
@QueryHandler(GetAppleLoginQuery)
export class GetAppleLoginQueryQueryHandler
  implements IQueryHandler<GetAppleLoginQuery>
{
  constructor(private configService: Configuration) {}

  async execute(query: GetAppleLoginQuery): Promise<SocialInterface | null> {
    const data = await appleSigninAuth.verifyIdToken(query.idToken, {
      audience: this.configService.apple().APPLE_APP_AUDIENCE,
    });

    return {
      id: data.sub,
      email: data.email,
      firstName: query.firstName,
      lastName: query.lastName,
    };
  }
}
