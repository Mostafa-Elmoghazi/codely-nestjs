import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'codely/codely.data';
import { ResetPasswordCommand } from './reset-password.command';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthMailService } from 'codely/codely.business/common/mails';
import { Configuration } from 'codely/codely.business/common';
import { User } from 'codely/codely.entities/data-models';
import * as bcrypt from 'bcryptjs';

@Injectable()
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private eventBus: EventBus,
    private jwtService: JwtService,
    private mailService: AuthMailService,
    private configService: Configuration,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: User['id'];
      }>(command.hash, {
        secret: this.configService.auth().AUTH_FORGOT_SECRET,
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `notFound`,
        },
      });
    }
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(command.password, salt);

    await this.userRepository.update(user.id, user);
  }
}
