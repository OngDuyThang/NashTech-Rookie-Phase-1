import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TJwtPayload, TLoginResponse } from './common/types';
import { Response } from 'express';
import { ERROR_MESSAGE } from '@app/common';
import { RegisterDto, UserEntity, UserService } from './modules/user';
import { authenticator } from 'otplib';
import { TokenService } from './modules/token/token.service';
import { Env } from '@app/env';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly env: Env,
    private readonly tokenService: TokenService,
  ) {}

  async register(
    registerDto: RegisterDto
  ): Promise<UserEntity> {
    return await this.userService.create(registerDto);
  }

  async validateCredential(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserEntity> {
    try {
      const user = await this.userService.findOne(usernameOrEmail);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new NotFoundException();
      }
      return user;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException(ERROR_MESSAGE.INVALID_CREDENTIAL);
      }
      throw e;
    }
  }

  authenticated(
    jwtPayload: TJwtPayload,
    res: Response
  ): void {
    const accessToken = this.tokenService.generateTokens(jwtPayload, this.env.ACCESS_TOKEN_SECRET, '1d');
    const refreshToken = this.tokenService.generateTokens(jwtPayload, this.env.REFRESH_TOKEN_SECRET, '1d');
    this.tokenService.sendTokens(accessToken, refreshToken, res);
  }

  async validateOtp(
    otp: string,
    userId: string,
    res: Response
  ): Promise<void> {
    try {
      const user = await this.userService.findOneById(userId);

      const isValid = authenticator.verify({
        token: otp,
        secret: user.twoFactorSecret,
      });

      if (!isValid) {
        throw new ForbiddenException(ERROR_MESSAGE.INVALID_OTP);
      }

      this.authenticated(
        this.tokenService.generateTokenPayload(user),
        res
      );
    } catch (e) {
      if (e instanceof ForbiddenException) {
        throw e;
      }
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_EXIST);
    }
  }

  login(
    user: UserEntity,
    res: Response
  ): TLoginResponse {
    if (user.enableTwoFactor) {
      return {
        validateOtpEndpoint: this.env.VALIDATE_OTP_ENDPONT,
        userId: user.id,
      };
    }

    this.authenticated(
      this.tokenService.generateTokenPayload(user),
      res
    );
  }
}
