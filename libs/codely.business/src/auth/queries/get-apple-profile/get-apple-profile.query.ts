import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Allow, IsNotEmpty } from 'class-validator';
import { IQuery } from '@nestjs/cqrs';

export class GetAppleLoginQuery implements IQuery {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  idToken: string;

  @Allow()
  @ApiPropertyOptional()
  firstName?: string;

  @Allow()
  @ApiPropertyOptional()
  lastName?: string;
}