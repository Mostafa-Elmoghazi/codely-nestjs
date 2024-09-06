import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'codely/codely.data';
import { RegisterUserCommand } from './register-user.command';
import { User } from 'codely/codely.entities/data-models';
import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserCreatedEvent } from 'codely/codely.entities/events';
import { AuthProvidersEnum, StatusEnum } from 'codely/codely.entities/enums';
import { JwtService } from '@nestjs/jwt';
import { AuthMailService } from 'codely/codely.business/common/mails';
import { uuid } from 'uuidv4';
import { Configuration } from 'codely/codely.business/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private eventBus: EventBus,
    private jwtService: JwtService,
    private mailService: AuthMailService, 
    private configService: Configuration
  ) {}

  async execute(command: RegisterUserCommand): Promise<User | null> {
    const clonedPayload = {
      ...command,
      id: uuid(),
      provider: AuthProvidersEnum.email,
      statusId: StatusEnum.inactive,
    };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.userRepository.findByEmail(
        clonedPayload.email,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }
    
    const user = await this.userRepository.create(clonedPayload);

    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret: this.configService.auth().AUTH_CONFIRM_EMAIL_SECRET,
        expiresIn: this.configService.auth().AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
      },
    );

    await this.mailService.userSignUp({
      to: command.email,
      data: {
        hash,
      },
    });
    this.eventBus.publish(new UserCreatedEvent(user.id));
    return user;
  }
}
