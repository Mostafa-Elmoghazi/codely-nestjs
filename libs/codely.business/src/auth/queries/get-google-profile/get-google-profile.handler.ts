import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { Configuration } from 'codely/codely.business/common';
import { GetGoogleLoginQuery } from './get-google-profile.query';
import { SocialInterface } from 'codely/codely.entities/dtos';

@Injectable()
@QueryHandler(GetGoogleLoginQuery)
export class GetGoogleLoginQueryQueryHandler
  implements IQueryHandler<GetGoogleLoginQuery>
{
  private google: OAuth2Client;

  constructor(private configService: Configuration) {
    this.google = new OAuth2Client(
      configService.google().GOOGLE_CLIENT_ID,
      configService.google().GOOGLE_CLIENT_SECRET,
    );
  }

  async execute(query: GetGoogleLoginQuery): Promise<SocialInterface | null> {
    const ticket = await this.google.verifyIdToken({
      idToken: query.idToken,
      audience: [this.configService.google().GOOGLE_CLIENT_ID]
    });

    const data = ticket.getPayload();

    if (!data) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'wrongToken',
        },
      });
    }

    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
    };
  }
}
