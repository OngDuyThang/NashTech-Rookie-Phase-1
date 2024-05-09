import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user';
import { TJwtPayload, TLoginResponse } from '../../common/types';
import { Response, CookieOptions } from 'express';
import { NODE_ENV } from '@app/common';
import { Env } from '@app/env';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_EXPIRY_TIME, TOKEN_KEY_NAME } from '../../common/enums';

@Injectable()
export class TokenService {
  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: this.env.NODE_ENV == NODE_ENV.DEVELOPMENT ? false : true,
  };

  constructor(
    private readonly jwtService: JwtService,
    private readonly env: Env,
  ) {}

  generateTokenPayload(
    user: UserEntity,
    hashedFingerprint: string
  ): TJwtPayload {
    const { id, username, email } = user;
    return {
      id,
      username,
      email,
      fingerprint: hashedFingerprint
    };
  }

  generateToken(
    payload: TJwtPayload,
    secret: string,
    expiresIn: string | number,
  ): string {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  sendTokens(
    accessToken: string,
    refreshToken: string,
    originalFingerprint: string | undefined,
    res: Response
  ): TLoginResponse {
    res.cookie(TOKEN_KEY_NAME.REFRESH_TOKEN, refreshToken, {
      ...this.cookieOptions,
      maxAge: TOKEN_EXPIRY_TIME.REFRESH_TOKEN
    });
    res.cookie(TOKEN_KEY_NAME.FINGERPRINT, originalFingerprint, {
      ...this.cookieOptions,
      maxAge: TOKEN_EXPIRY_TIME.ACCESS_TOKEN // fingerprint inside cookie combine with access token, so equal expiry time
    })

    return {
      [TOKEN_KEY_NAME.ACCESS_TOKEN]: accessToken,
    }

    // Bonus idea: when access token and fingerprint are expired
    // then when sending refresh token, also check for different domain in Redis, if true, send email to warning user about hacker
  }

  sendGoogleIdToken(
    idToken: string,
    res: Response
  ): void {
    res.cookie(TOKEN_KEY_NAME.GOOGLE_ID_TOKEN, idToken, {
      httpOnly: true,
      sameSite: true,
      secure: false,
      maxAge: TOKEN_EXPIRY_TIME.GOOGLE_ID_TOKEN
    })
  }
}
