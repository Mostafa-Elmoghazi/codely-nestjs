import { ICommand } from '@nestjs/cqrs';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserProfileCommand implements ICommand {
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  id: string;
  @IsOptional()
  photoUrl?: string | null;

  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  firstName?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  lastName?: string;
}
