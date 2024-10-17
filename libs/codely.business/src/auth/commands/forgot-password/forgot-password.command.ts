import { ApiProperty } from '@nestjs/swagger';
import { ICommand } from '@nestjs/cqrs';
import { IsEmail } from 'class-validator';

export class ForgotPasswordCommand implements ICommand {
  constructor(email: string) {
    this.email = email;
  }
  @ApiProperty({ example: 'email@domain.com', type: String })
  @IsEmail()
  email: string;
}
