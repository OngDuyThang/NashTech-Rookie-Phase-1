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
import { resetPwMailTemplate } from './views';
import { OAuth2Client } from 'google-auth-library'
import { TOKEN_EXPIRY_TIME } from './common/enums';

@Injectable()
export class AuthService {
  private readonly googleOAuthClient = new OAuth2Client();

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

  generateFingerprint(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  async hashFingerprint(
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
    const accessToken = this.tokenService.generateToken(jwtPayload, this.env.ACCESS_TOKEN_SECRET, TOKEN_EXPIRY_TIME.ACCESS_TOKEN);

    delete jwtPayload.fingerprint
    const refreshToken = this.tokenService.generateToken(jwtPayload, this.env.REFRESH_TOKEN_SECRET, TOKEN_EXPIRY_TIME.REFRESH_TOKEN);

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
    id: string,
    email: string
  ): Promise<TForgotPasswordResponse> {

    const oneTimeToken = this.generateFingerprint()
    await this.userService.updateOneTimeToken(id, oneTimeToken)

    const endpoint = `${this.env.RESET_PASSWORD_ENDPOINT}?id=${id}`

    return new Promise((resolve) => {
      this.mailerService.sendMail({
        from: this.env.MAILER_USERNAME,
        to: email,
        subject: 'Forgot Password',
        html: resetPwMailTemplate(endpoint)
      },
        (error, _info) => {
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

  async validateOneTimeToken(
    hashedOneTimeToken: string,
    oneTimeToken: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(oneTimeToken, hashedOneTimeToken);
    } catch (e) {
      throw e;
    }
  }

  async resetPassword(
    id: string,
    newPassword: string
  ): Promise<void> {
    await this.userService.updatePassword(id, newPassword)
  }

  //

  async validateGoogleIdToken(
    idToken: string
  ): Promise<void> {
    try {
      const ticket = await this.googleOAuthClient.verifyIdToken({
        idToken,
        audience: this.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userId = payload['sub'];

      console.log('payload: ', payload)
      console.log('userId: ', userId)
    } catch (e) {
      throw e
    }
  }
}
