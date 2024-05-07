import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { TEnableTwoFactorResponse, TForgotPasswordResponse, TJwtPayload, TLoginResponse } from './common/types';
import { Response } from 'express';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@app/common';
import { RegisterDto, UserEntity, UserService } from './modules/user';
import { authenticator } from 'otplib';
import { TokenService } from './modules/token/token.service';
import { Env } from '@app/env';
import { Transporter } from 'nodemailer';
import { MAILER_SERVICE } from '@app/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly env: Env,
    private readonly tokenService: TokenService,
    @Inject(MAILER_SERVICE)
    private readonly mailerService: Transporter
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

  private generateFingerprint(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  private async hashFingerprint(
    fingerprint: string
  ): Promise<string> {
    try {
      const salt = await bcrypt.genSalt()
      return await bcrypt.hash(fingerprint, salt)
    } catch (e) {
      throw e
    }
  }

  private authenticated(
    jwtPayload: TJwtPayload,
    originalFingerprint: string,
    res: Response
  ): TLoginResponse {
    const accessToken = this.tokenService.generateToken(jwtPayload, this.env.ACCESS_TOKEN_SECRET, '1d');

    delete jwtPayload.fingerprint
    const refreshToken = this.tokenService.generateToken(jwtPayload, this.env.REFRESH_TOKEN_SECRET, '1d');

    return this.tokenService.sendTokens(accessToken, refreshToken, originalFingerprint, res);
  }

  async login(
    user: UserEntity,
    res: Response
  ): Promise<TLoginResponse> {
    const fingerprint = this.generateFingerprint()

    if (user.enableTwoFactor) {
      return {
        validateOtpEndpoint: this.env.VALIDATE_OTP_ENDPONT,
        userId: user.id,
      };
    }

    const jwtPayload: TJwtPayload = this.tokenService.generateTokenPayload(
      user,
      await this.hashFingerprint(fingerprint)
    )

    return this.authenticated(
      jwtPayload,
      fingerprint,
      res
    );
  }

  async enableTwoFactor(
    userId: string
  ): Promise<TEnableTwoFactorResponse> {
    try {
      const user = await this.userService.findOneById(userId)

      if (user.enableTwoFactor && user.twoFactorSecret) {
        return {
          twoFactorSecret: user.twoFactorSecret
        }
      }

      return await this.userService.enableTwoFactor(userId);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException(ERROR_MESSAGE.USER_NOT_EXIST);
      }
      throw e
    }
  }

  async disableTwoFactor(
    userId: string
  ): Promise<void> {
    await this.userService.disableTwoFactor(userId);
  }

  async validateOtp(
    otp: string,
    userId: string,
    res: Response
  ): Promise<TLoginResponse> {
    try {
      const user = await this.userService.findOneById(userId);

      const isValid = authenticator.verify({
        token: otp,
        secret: user.twoFactorSecret,
      });

      if (!isValid) {
        throw new ForbiddenException(ERROR_MESSAGE.INVALID_OTP);
      }

      const fingerprint = this.generateFingerprint()
      const jwtPayload: TJwtPayload = this.tokenService.generateTokenPayload(
        user,
        await this.hashFingerprint(fingerprint)
      )

      return this.authenticated(
        jwtPayload,
        fingerprint,
        res
      );
    } catch (e) {
      throw e;
    }
  }

  async forgotPassword(
    email: string
  ): Promise<TForgotPasswordResponse> {
    const link = `http://localhost:3000/auth/reset-password?token=some-unhashed-token-here-then-hash-to-compare&id=user-id-here`

    return new Promise((resolve) => {
      this.mailerService.sendMail({
        from: this.env.MAILER_USERNAME,
        to: email,
        subject: 'Forgot Password',
        html: `<p><a href='${link}'>Click here to reset password</a></p>`
      }, (error, _info) => {
        if (error) {
          throw new NotFoundException(ERROR_MESSAGE.INVALID_EMAIL);
        } else {
          resolve({
            message: SUCCESS_MESSAGE.EMAIL_SENT
          })
        }
      })
    })
  }
}
