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
    const options: CookieOptions = {
      httpOnly: true,
      sameSite: 'none',
      secure: this.env.NODE_ENV == NODE_ENV.DEVELOPMENT ? false : true,
    };
    res.cookie(TOKEN_KEY_NAME.REFRESH_TOKEN, refreshToken, {
      ...options,
      maxAge: TOKEN_EXPIRY_TIME.REFRESH_TOKEN
    });
    res.cookie(TOKEN_KEY_NAME.FINGERPRINT, originalFingerprint, {
      ...options,
      maxAge: TOKEN_EXPIRY_TIME.ACCESS_TOKEN // fingerprint inside cookie combine with access token, so equal expiry time
    })

    return {
      [TOKEN_KEY_NAME.ACCESS_TOKEN]: accessToken,
    }
  }
}
