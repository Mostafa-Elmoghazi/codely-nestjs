import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'codely/codely.data';
import { User } from 'codely/codely.entities/data-models';
import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserCreatedEvent } from 'codely/codely.entities/events';
import { AuthProvidersEnum, StatusEnum } from 'codely/codely.entities/enums';
import { JwtService } from '@nestjs/jwt';
import { AuthMailService } from 'codely/codely.business/common/mails';
import { uuid } from 'uuidv4';
import { Configuration } from 'codely/codely.business/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';
import { ValidateSocialLoginCommand } from './validate-social-login.command';
import { LoginResponseDto } from 'codely/codely.entities/dtos';
import { NullableType } from '@app/core/utils';

@Injectable()
@CommandHandler(ValidateSocialLoginCommand)
export class ValidateSocialLoginCommandHandler implements ICommandHandler<ValidateSocialLoginCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private eventBus: EventBus,
    private jwtService: JwtService,
    private mailService: AuthMailService, 
    private configService: Configuration
  ) {}

  async execute(command: ValidateSocialLoginCommand): Promise<LoginResponseDto> {
    let user: NullableType<User> = null;
    const socialEmail = command.socialData.email?.toLowerCase();
    let userByEmail: NullableType<User> = null;

    if (socialEmail) {
      userByEmail = await this.userRepository.findByEmail(socialEmail);
    }

    if (command.socialData.id) {
      user = await this.userRepository.findBySocialIdAndProvider(command.socialData.id, command.authProvider);
    }

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.userRepository.update(user.id, user);
    } else if (userByEmail) {
      user = userByEmail;
    } else if (command.socialData.id) {

      user = await this.userRepository.create({
        id: uuid(),
        email: socialEmail ?? null,
        firstName: command.socialData.firstName ?? null,
        lastName: command.socialData.lastName ?? null,
        socialId: command.socialData.id,
        provider: command.authProvider,
        statusId: StatusEnum.active,
      });

      user = await this.userRepository.findOne({id: user.id});
    }

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'userNotFound',
        },
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const {
      token: jwtToken,
      refreshToken,
      tokenExpires,
    } = await this.getTokensData({
      id: user.id,
      role: 'user',
      hash,
    });

    return {
      refreshToken,
      token: jwtToken,
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
