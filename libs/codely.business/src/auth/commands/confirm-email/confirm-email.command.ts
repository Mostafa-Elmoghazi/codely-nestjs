import { ApiProperty } from '@nestjs/swagger';
import { ICommand } from '@nestjs/cqrs';

export class ConfirmEmailCommand implements ICommand {
  constructor(hash: string) {
    this.hash = hash;
  }
  @ApiProperty({ example: 'abcde', type: String })
  hash: string;
}
