import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './common/decorators';
import { HashPasswordPipe } from './common/pipes';
import { HideSensitiveInterceptor } from './common/interceptors';
import { AccessTokenGuard, LocalAuthGuard, ValidateOtpGuard, ForgotPasswordGuard } from './common/guards';
import { RegisterDto, UserEntity } from './modules/user';
import { Request, Response } from 'express';
import { TEnableTwoFactorResponse, TForgotPasswordResponse, TLoginResponse } from './common/types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/register')
  @UsePipes(HashPasswordPipe)
  @UseInterceptors(HideSensitiveInterceptor)
  async register(
    @Body() registerDto: RegisterDto
  ): Promise<UserEntity> {
    return await this.authService.register(registerDto);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response
  ): Promise<TLoginResponse> {
    return await this.authService.login(user, res);
  }

  @Post('/enable-2fa')
  @UseGuards(AccessTokenGuard)
  async enableTwoFactor(
    @GetUser() user: UserEntity
  ): Promise<TEnableTwoFactorResponse> {
    return await this.authService.enableTwoFactor(user.id);
  }

  @Post('/disable-2fa')
  @UseGuards(AccessTokenGuard)
  async disableTwoFactor(
    @GetUser() user: UserEntity
  ) {
    await this.authService.disableTwoFactor(user.id)
  }

  @Post('/validate-otp')
  @UseGuards(ValidateOtpGuard)
  validateOtp(
    @Req() req: Request
  ): Promise<TLoginResponse> {
    return req.user as any
  }

  @Post('/forgot-password')
  @UseGuards(ForgotPasswordGuard)
  async forgotPassword(
    @GetUser() user: UserEntity
  ): Promise<TForgotPasswordResponse> {
    return await this.authService.forgotPassword(user.email)
  }

  // Implement with front end page to reset password
  @Get('/reset-password')
  resetPassword(
    @Query() query: any
  ) {
    console.log(query)
  }
}
