import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Query,
  SerializeOptions,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { BaseController } from '../base.controller';
import { Mediator } from 'codely/codely.business/common';
import {
  ForgotPasswordCommand,
  RegisterUserCommand,
  ResetPasswordCommand,
  UpdateUserProfileCommand,
  ValidateSocialLoginCommand,
} from 'codely/codely.business/auth/commands';
import {
  GetGoogleLoginQuery,
  GetUserProfileQuery,
  ValidateLoginQuery,
} from 'codely/codely.business/auth/queries';
import {
  AuthConfirmEmailDto,
  AuthForgotPasswordDto,
  AuthResetPasswordDto,
  AuthUpdateDto,
  AuthUserDto,
  LoginResponseDto,
} from 'codely/codely.entities/dtos';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ConfirmEmailCommand } from 'codely/codely.business/auth/commands/confirm-email/confirm-email.command';
import { NullableType } from '@app/core/utils';
import { User } from 'codely/codely.entities/data-models';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';

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
  async login(
    @Body() loginQuery: ValidateLoginQuery,
  ): Promise<LoginResponseDto> {
    return await this.mediator.query(loginQuery);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.mediator.command(new ConfirmEmailCommand(confirmEmailDto.hash));
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.mediator.command(
      new ForgotPasswordCommand(forgotPasswordDto.email),
    );
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.mediator.command(
      new ResetPasswordCommand(
        resetPasswordDto.password,
        resetPasswordDto.hash,
      ),
    );
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  public async me(@Request() request): Promise<NullableType<AuthUserDto>> {
    return await this.mediator.query(
      new GetUserProfileQuery((request.user as JwtPayloadType).id),
    );
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: User,
  })
  public update(
    @Request() request,
    @Body() userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    const cmd = new UpdateUserProfileCommand();
    cmd.firstName = userDto.firstName;
    cmd.lastName = userDto.lastName;
    cmd.photoUrl = userDto.photo;
    cmd.id = request.user.id;
    return this.mediator.command(cmd);
  }

  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  async googleLogin(
    @Body() query: GetGoogleLoginQuery,
  ): Promise<LoginResponseDto> {
    const socialData = await this.mediator.query(query);
    return this.mediator.command(
      new ValidateSocialLoginCommand('google', socialData),
    );
  }

  // @ApiOkResponse({
  //   type: LoginResponseDto,
  // })
  // @SerializeOptions({
  //   groups: ['me'],
  // })
  // @Post('apple/login')
  // @HttpCode(HttpStatus.OK)
  // async appleLogin(@Body() query: GetAppleLoginQuery): Promise<LoginResponseDto> {
  //   const socialData = await this.mediator.query(query);
  //   return this.mediator.command(new ValidateSocialLoginCommand('apple', socialData));
  // }
}
