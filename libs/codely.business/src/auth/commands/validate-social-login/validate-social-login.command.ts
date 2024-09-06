import { ApiProperty } from '@nestjs/swagger';
import { ICommand } from '@nestjs/cqrs';
import { SocialInterface } from 'codely/codely.entities/dtos';

export class ValidateSocialLoginCommand implements ICommand {
  constructor(authProvider: string, socialData: SocialInterface){
    this.authProvider = authProvider;
    this.socialData = socialData;
  }
  @ApiProperty({ type: String })
  authProvider: string;

  @ApiProperty()
  socialData: SocialInterface;
}