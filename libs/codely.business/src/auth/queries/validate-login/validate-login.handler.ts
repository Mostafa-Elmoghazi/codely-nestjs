import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from 'codely/codely.data';
import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ValidateLoginQuery } from './validate-login.query';
import { LoginResponseDto } from 'codely/codely.entities/dtos';
import { AuthProvidersEnum } from 'codely/codely.entities/enums';
import ms from 'ms';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Configuration } from 'codely/codely.business/common';

@Injectable()
@QueryHandler(ValidateLoginQuery)
export class ValidateLoginQueryHandler
  implements IQueryHandler<ValidateLoginQuery>
{
  constructor(
    private readonly userRepository: UserRepository,
    private configService: Configuration,
    private jwtService: JwtService
  ) {}

  async execute(query: ValidateLoginQuery): Promise<LoginResponseDto | null> {
    const user = await this.userRepository.findByEmail(query.email);
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: `needLoginViaProvider:${user.provider}`,
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const isValidPassword = await bcrypt.compare(query.password, user.password);

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    // const session = await this.sessionService.create({
    //   user,
    //   hash,
    // });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: 'user',
      hash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }
  
  private async getTokensData(data: {
    id: string;
    role: string;
    hash: string;
  }) {
    const tokenExpiresIn = parseInt(this.configService.auth().AUTH_JWT_TOKEN_EXPIRES_IN);
    const tokenExpires = Date.now() + tokenExpiresIn * 60 * 1000;

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role
        },
        {
          secret: this.configService.auth().AUTH_JWT_SECRET,
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          //sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.auth().AUTH_REFRESH_SECRET,
          expiresIn: this.configService.auth().AUTH_REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
