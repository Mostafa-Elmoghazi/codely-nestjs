import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'codely/codely.data';
import { ForgotPasswordCommand } from './forgot-password.command';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthMailService } from 'codely/codely.business/common/mails';
import { Configuration } from 'codely/codely.business/common';

@Injectable()
@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordCommandHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private eventBus: EventBus,
    private jwtService: JwtService,
    private mailService: AuthMailService,
    private configService: Configuration,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'emailNotExists',
        },
      });
    }

    const tokenExpiresIn =
      this.configService.auth().AUTH_FORGOT_TOKEN_EXPIRES_IN * 60 * 1000;

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        secret: this.configService.auth().AUTH_FORGOT_SECRET,
        expiresIn: tokenExpiresIn,
      },
    );

    await this.mailService.forgotPassword({
      to: command.email,
      data: {
        hash,
        tokenExpires: tokenExpiresIn,
      },
    });
  }
}
