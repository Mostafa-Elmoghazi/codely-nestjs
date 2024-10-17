import { ApiProperty } from '@nestjs/swagger';
import { ICommand } from '@nestjs/cqrs';

export class ResetPasswordCommand implements ICommand {
  constructor(password: string, hash: string) {
    this.password = password;
    this.hash = hash;
  }
  @ApiProperty({ example: '1dfwer', type: String })
  password: string;
  @ApiProperty({ example: 'asdfasdfds', type: String })
  hash: string;
}
