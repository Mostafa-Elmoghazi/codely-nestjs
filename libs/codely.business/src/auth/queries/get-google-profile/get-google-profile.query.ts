import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IQuery } from '@nestjs/cqrs';

export class GetGoogleLoginQuery implements IQuery {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  idToken: string;
}