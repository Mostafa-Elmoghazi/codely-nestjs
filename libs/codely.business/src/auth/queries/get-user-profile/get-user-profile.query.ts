import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IQuery } from '@nestjs/cqrs';

export class GetUserProfileQuery implements IQuery {
  constructor(id: string) {
    this.id = id;
  }
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
