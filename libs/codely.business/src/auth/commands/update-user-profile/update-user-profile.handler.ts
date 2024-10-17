import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'codely/codely.data';
import { UpdateUserProfileCommand } from './update-user-profile.command';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from 'codely/codely.entities/data-models';

@Injectable()
@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileCommandHandler
  implements ICommandHandler<UpdateUserProfileCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UpdateUserProfileCommand): Promise<User> {
    const currentUser = await this.userRepository.findById(command.id);

    if (!currentUser) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'userNotFound',
        },
      });
    }

    await this.userRepository.update(command.id, command);

    return this.userRepository.findById(command.id);
  }
}
