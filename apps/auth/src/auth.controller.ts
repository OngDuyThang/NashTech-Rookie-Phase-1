import { Body, Controller, Get, Patch, Post, Render, Req, Res, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './common/decorators';
import { HashPasswordPipe } from './common/pipes';
import { HideSensitiveInterceptor } from './common/interceptors';
import { AccessTokenGuard, LocalAuthGuard, ValidateOtpGuard, ForgotPasswordGuard, UserExistGuard, ValidateOttGuard } from './common/guards';
import { RegisterDto, UserEntity } from './modules/user';
import { Request, Response } from 'express';
import { TEnableTwoFactorResponse, TForgotPasswordResponse, TLoginResponse } from './common/types';
import { ResetPasswordDto } from './common/dtos';
import { OTT_KEY_NAME } from './common/constants';

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

  @Patch('/enable-2fa')
  @UseGuards(AccessTokenGuard)
  async enableTwoFactor(
    @GetUser() user: UserEntity
  ): Promise<TEnableTwoFactorResponse> {
    return await this.authService.enableTwoFactor(user.id);
  }

  @Patch('/disable-2fa')
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
  ): TLoginResponse {
    return req.user as TLoginResponse
  }

  @Post('/forgot-password')
  @UseGuards(ForgotPasswordGuard)
  forgotPassword(
    @Req() req: Request
  ): TForgotPasswordResponse {
    return req.user as TForgotPasswordResponse
  }

  @Get('/reset-password')
  @UseGuards(UserExistGuard)
  @Render('reset-password')
  async resetPasswordForm(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const hashedOneTimeToken = await this.authService.hashFingerprint(user.oneTimeToken)
    res.cookie(OTT_KEY_NAME, hashedOneTimeToken, {
      httpOnly: true,
      sameSite: true,
      secure: false,
      maxAge: 10 * 60 * 1000, // 10 minutes
    })
    return
  }

  @Patch('/reset-password')
  @UseGuards(UserExistGuard, ValidateOttGuard)
  @UsePipes(HashPasswordPipe)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<void> {
    const { id, newPassword } = resetPasswordDto
    await this.authService.resetPassword(id, newPassword)
  }

  // @Post('/google/callback')
}
