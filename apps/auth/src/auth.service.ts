import {
  ForbiddenException,
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { TEnableTwoFactorResponse, TForgotPasswordResponse, TGoogleLoginResponse, TJwtPayload, TLoginResponse, TTokenResponse } from './common/types';
import { Response } from 'express';
import { ERROR_MESSAGE, SUCCESS_MESSAGE, getUrlEndpoint } from '@app/common';
import { RegisterDto, UserEntity, UserService } from './modules/user';
import { authenticator } from 'otplib';
import { TokenService } from './modules/token';
import { Env } from '@app/env';
import { Transporter } from 'nodemailer';
import { MAILER_SERVICE } from '@app/mailer';
import { resetPwMailTemplate } from './views';
import { OAuth2Client } from 'google-auth-library'
import { OPENID_PROVIDER, TOKEN_EXPIRY_TIME } from './common/enums';
import { CACHE_SERVICE } from '@app/cache';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  private readonly googleOAuthClient = new OAuth2Client();

  constructor(
    private readonly userService: UserService,
    private readonly env: Env,
    private readonly tokenService: TokenService,
    @Inject(MAILER_SERVICE)
    private readonly mailerService: Transporter,
    @Inject(CACHE_SERVICE)
    private readonly cacheService: Cache
  ) {}

  async register(
    registerDto: RegisterDto
  ): Promise<void> {
    await this.userService.create(registerDto)
  }

  async validateCredential(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserEntity> {
    if (!usernameOrEmail || !password) {
      throw new NotFoundException(ERROR_MESSAGE.INVALID_CREDENTIAL);
    }
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

  private async cacheAuthCode(
    authCode: string,
    userId: string
  ): Promise<void> {
    try {
      const existCache = await this.cacheService.get<string>(authCode)
      if (existCache) {
        return
      }

      await this.cacheService.set(
        authCode,
        userId
      )
    } catch (e) {
      throw e
    }
  }

  private async getClientCallbackUrl(
    userId: string
  ): Promise<string> {
    const authCode = this.generateFingerprint()
    await this.cacheAuthCode(authCode, userId)

    // Url to trigger client to send token request
    return getUrlEndpoint(
      this.env.SERVICE_HOST_NAME,
      this.env.SERVICE_PORT,
      '/auth/something',
      { code: authCode }
    )
  }

  async login(
    user: UserEntity
  ): Promise<TLoginResponse> {
    if (user.enable_two_factor) {
      return {
        validateOtpEndpoint: getUrlEndpoint(
          this.env.SERVICE_HOST_NAME,
          this.env.SERVICE_PORT,
          this.env.VALIDATE_OTP_PATH_NAME
        ),
        userId: user.id,
      };
    }

    // Return client callback url to client with authorization code in query
    const clientCallbackUrl = await this.getClientCallbackUrl(user.id)
    return {
      clientCallbackUrl
    }
  }

  async enableTwoFactor(
    userId: string
  ): Promise<TEnableTwoFactorResponse> {
    try {
      const user = await this.userService.findOneById(userId)

      if (user.enable_two_factor && user.two_factor_secret) {
        return {
          twoFactorSecret: user.two_factor_secret
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
    userId: string
  ): Promise<TLoginResponse> {
    try {
      const user = await this.userService.findOneById(userId);
      if (!user.enable_two_factor) {
        throw new MethodNotAllowedException(ERROR_MESSAGE.METHOD_NOT_ALLOWED);
      }

      const isValid = authenticator.verify({
        token: otp,
        secret: user.two_factor_secret,
      });

      if (!isValid) {
        throw new ForbiddenException(ERROR_MESSAGE.INVALID_OTP);
      }

      // Return client call back url to client with authorization code in query
      const clientCallbackUrl = await this.getClientCallbackUrl(user.id)
      return {
        clientCallbackUrl
      }
    } catch (e) {
      throw e;
    }
  }

  async authenticated(
    user: UserEntity,
    res: Response
  ): Promise<TTokenResponse> {
    const fingerprint = this.generateFingerprint()
    const hashedFingerprint = await this.hashFingerprint(fingerprint)

    const jwtPayload: TJwtPayload = this.tokenService.generateTokenPayload(
      user,
      hashedFingerprint
    )

    const accessToken = this.tokenService.generateToken(jwtPayload, this.env.ACCESS_TOKEN_SECRET, TOKEN_EXPIRY_TIME.ACCESS_TOKEN);

    delete jwtPayload.fingerprint
    const refreshToken = this.tokenService.generateToken(jwtPayload, this.env.REFRESH_TOKEN_SECRET, TOKEN_EXPIRY_TIME.REFRESH_TOKEN);

    return this.tokenService.sendTokens(accessToken, refreshToken, fingerprint, res);
  }

  async forgotPassword(
    userId: string,
    email: string
  ): Promise<TForgotPasswordResponse> {
    const oneTimeToken = this.generateFingerprint()
    await this.userService.updateOneTimeToken(userId, oneTimeToken)

    const endpoint = getUrlEndpoint(
      this.env.SERVICE_HOST_NAME,
      this.env.SERVICE_PORT,
      this.env.RESET_PASSWORD_PATH_NAME,
      { userId }
    )

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
    if (!hashedOneTimeToken || !oneTimeToken) {
      throw new ForbiddenException(ERROR_MESSAGE.UNAUTHORIZED)
    }
    try {
      return await bcrypt.compare(oneTimeToken, hashedOneTimeToken);
    } catch (e) {
      throw e;
    }
  }

  async resetPassword(
    userId: string,
    newPassword: string
  ): Promise<void> {
    await this.userService.updatePassword(userId, newPassword)
  }

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

  async loginWithGoogle(
    googleRes: TGoogleLoginResponse,
    res: Response
  ): Promise<void> {
    const { email, verify } = googleRes
    if (!verify) {
      throw new UnauthorizedException(ERROR_MESSAGE.UNAUTHORIZED_GOOGLE_ACCOUNT)
    }

    const user = await this.userService.validateExistEmail(email);
    if (user) {
      if (user.openid_provider == OPENID_PROVIDER.google) {
        // Return client call back url to client with authorization code in query
        const clientCallbackUrl = await this.getClientCallbackUrl(user.id)
        res.redirect(clientCallbackUrl)
      } else {
        // Redirect to exist email page
        res.redirect(getUrlEndpoint(
          this.env.SERVICE_HOST_NAME,
          this.env.SERVICE_PORT,
          '/auth/used-email'
        ))
      }
    } else {
      // Redirect to register page
      res.redirect(getUrlEndpoint(
        this.env.SERVICE_HOST_NAME,
        this.env.SERVICE_PORT,
        '/auth/register',
        { gmail: email }
      ))
    }
  }
}
