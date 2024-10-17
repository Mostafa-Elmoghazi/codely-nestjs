import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from 'codely/codely.data';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GetUserProfileQuery } from './get-user-profile.query';
import { JwtService } from '@nestjs/jwt';
import { Configuration } from 'codely/codely.business/common';
import { User } from 'codely/codely.entities/data-models';
import { AuthUserDto } from 'codely/codely.entities/dtos';

@Injectable()
@QueryHandler(GetUserProfileQuery)
export class GetUserProfileQueryHandler
  implements IQueryHandler<GetUserProfileQuery>
{
  constructor(
    private readonly userRepository: UserRepository,
    private configService: Configuration,
    private jwtService: JwtService,
  ) {}

  async execute(query: GetUserProfileQuery): Promise<AuthUserDto | null> {
    const user = await this.userRepository.findById(query.id);
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
