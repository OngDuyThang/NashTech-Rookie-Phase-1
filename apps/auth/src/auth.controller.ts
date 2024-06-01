import { Body, Controller, Get, Patch, Post, Render, Req, Res, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './common/decorators';
import { HashPasswordPipe } from './common/pipes';
import { HideSensitiveInterceptor } from './common/interceptors';
import { AccessTokenGuard, LocalAuthGuard, ValidateOtpGuard, ForgotPasswordGuard, ResetPasswordGuard, ValidateOttGuard, GoogleAuthGuard, ValidateAuthCodeGuard } from './common/guards';
import { RegisterDto, UserEntity } from './modules/user';
import { Request, Response } from 'express';
import { TEnableTwoFactorResponse, TForgotPasswordResponse, TGoogleLoginResponse, TLoginResponse, TTokenResponse } from './common/types';
import { RefreshTokenDto, ResetPasswordDto } from './common/dtos';
import { TOKEN_KEY_NAME } from './common/enums';
import { MessagePattern } from '@nestjs/microservices';
import { SERVICE_MESSAGE } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('/register')
  @Render('register')
  registerPage(): void {}

  @Post('/register')
  @UsePipes(HashPasswordPipe)
  @UseInterceptors(HideSensitiveInterceptor)
  async register(
    @Body() registerDto: RegisterDto
  ): Promise<void> {
    await this.authService.register(registerDto);
  }

  @Get('/login')
  @Render('login')
  loginPage(): void {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(
    @GetUser() user: UserEntity
  ): Promise<TLoginResponse> {
    return await this.authService.login(user);
  }

  // event pattern
  @Patch('/enable-2fa')
  @UseGuards(AccessTokenGuard)
  async enableTwoFactor(
    @GetUser() user: UserEntity
  ): Promise<TEnableTwoFactorResponse> {
    return await this.authService.enableTwoFactor(user.id);
  }

  // event pattern
  @Patch('/disable-2fa')
  @UseGuards(AccessTokenGuard)
  async disableTwoFactor(
    @GetUser() user: UserEntity
  ) {
    await this.authService.disableTwoFactor(user.id)
  }

  @Get('/2fa')
  @Render('2fa')
  twoFactorPage(): void {}

  @Post('/validate-otp')
  @UseGuards(ValidateOtpGuard)
  validateOtp(
    @Req() req: Request
  ): TLoginResponse {
    return req.user as TLoginResponse
  }

  @Post('/token')
  @UseGuards(ValidateAuthCodeGuard)
  async exchangeToken(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response
  ): Promise<TTokenResponse> {
    return await this.authService.authenticated(user, res)
  }

  @Post('/forgot-password')
  @UseGuards(ForgotPasswordGuard)
  forgotPassword(
    @Req() req: Request
  ): TForgotPasswordResponse {
    return req.user as TForgotPasswordResponse
  }

  @Get('/reset-password')
  @UseGuards(ResetPasswordGuard)
  @Render('reset-password')
  async resetPasswordForm(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const hashedOneTimeToken = await this.authService.hashFingerprint(user.one_time_token)
    res.cookie(TOKEN_KEY_NAME.ONE_TIME_TOKEN, hashedOneTimeToken, {
      httpOnly: true,
      sameSite: true,
      secure: false,
      maxAge: 10 * 60 * 1000, // 10 minutes
    })
    return
  }

  @Patch('/reset-password')
  @UseGuards(ResetPasswordGuard, ValidateOttGuard)
  @UsePipes(HashPasswordPipe)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<void> {
    const { userId, newPassword } = resetPasswordDto
    await this.authService.resetPassword(userId, newPassword)
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  loginWithGoogle() {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallback(
    @Req() req: Request,
    @Res() res: Response
  ) {
    const googleRes = req.user as TGoogleLoginResponse
    this.authService.loginWithGoogle(googleRes, res)
  }

  // Authorization for other services
  @MessagePattern({ cmd: SERVICE_MESSAGE.VALIDATE_JWT })
  @UseGuards(AccessTokenGuard)
  permissionProvider(
    @GetUser() user: UserEntity
  ): UserEntity {
    return user
  }

  @Get('/something')
  something(
    @Req() req: Request
  ) {
    console.log(req.query.code)
    fetch('http://localhost:3000/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authCode: req.query.code
      })
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err))
  }

  @Get('/used-email')
  usedEmailPage() {
    console.log('used email')
  }

  @Post('/refresh')
  refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<TTokenResponse> {
    const accessToken = refreshTokenDto.access_token
    return this.authService.refresh(req, res, accessToken)
  }

  @Post('/logout')
  logout(
    @Res({ passthrough: true }) res: Response
  ): void {
    res.clearCookie(TOKEN_KEY_NAME.FINGERPRINT)
    res.clearCookie(TOKEN_KEY_NAME.REFRESH_TOKEN)
  }
}
