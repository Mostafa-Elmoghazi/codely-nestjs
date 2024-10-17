import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'codely/codely.data';
import { ConfirmEmailCommand } from './confirm-email.command';
import { User } from 'codely/codely.entities/data-models';
import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StatusEnum } from 'codely/codely.entities/enums';
import { JwtService } from '@nestjs/jwt';
import { AuthMailService } from 'codely/codely.business/common/mails';
import { Configuration } from 'codely/codely.business/common';

@Injectable()
@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailCommandHandler
  implements ICommandHandler<ConfirmEmailCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private eventBus: EventBus,
    private jwtService: JwtService,
    private mailService: AuthMailService,
    private configService: Configuration,
  ) {}

  async execute(command: ConfirmEmailCommand): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
      }>(command.hash, {
        secret: this.configService.auth().AUTH_CONFIRM_EMAIL_SECRET,
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.userRepository.findById(userId);

    if (
      !user ||
      user?.statusId?.toString() !== StatusEnum.notVerified.toString()
    ) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `notFound`,
      });
    }

    user.statusId = StatusEnum.active;

    await this.userRepository.update(user.id, user);
  }
}
