import { Body, Controller, Get, Post, Res, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './common/decorators';
import { HashPasswordPipe } from './common/pipes';
import { HidePasswordInterceptor } from './common/interceptors';
import { LocalAuthGuard } from './common/guards';
import { RegisterDto, UserEntity } from './modules/user';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  @UsePipes(HashPasswordPipe)
  @UseInterceptors(HidePasswordInterceptor)
  async register(
    @Body() registerDto: RegisterDto
  ): Promise<UserEntity> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response
  ): void {
    this.authService.login(user, res);
  }
}
