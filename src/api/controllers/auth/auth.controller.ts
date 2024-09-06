import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, SerializeOptions } from '@nestjs/common';
import { BaseController } from '../base.controller';
import { Mediator } from 'codely/codely.business/common';
import { RegisterUserCommand, ValidateSocialLoginCommand } from 'codely/codely.business/auth/commands';
import { GetAppleLoginQuery, GetGoogleLoginQuery, ValidateLoginQuery } from 'codely/codely.business/auth/queries';
import { LoginResponseDto } from 'codely/codely.entities/dtos';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private mediator: Mediator) {
    super();
  }

  @Post('email/register')
  async register(@Body() registerUser: RegisterUserCommand): Promise<void> {
    await this.mediator.command(registerUser);
  }

  @Post('email/login')
  async login(@Body() loginQuery: ValidateLoginQuery): Promise<LoginResponseDto> {
    return await this.mediator.query(loginQuery);
  }

  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() query: GetGoogleLoginQuery): Promise<LoginResponseDto> {
    const socialData = await this.mediator.query(query);
    return this.mediator.command(new ValidateSocialLoginCommand('google', socialData));
  }

  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('apple/login')
  @HttpCode(HttpStatus.OK)
  async appleLogin(@Body() query: GetAppleLoginQuery): Promise<LoginResponseDto> {
    const socialData = await this.mediator.query(query);
    return this.mediator.command(new ValidateSocialLoginCommand('apple', socialData));
  }
}
