import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user';
import { TJwtPayload, TLoginResponse } from '../../common/types';
import { Response, CookieOptions } from 'express';
import { NODE_ENV, SUCCESS_CODE } from '@app/common';
import { Env } from '@app/env';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_KEY_NAME } from '../../common/enums';

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
    expiresIn: string,
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
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie(TOKEN_KEY_NAME.REFRESH_TOKEN, refreshToken, options);
    res.cookie('fingerprint', originalFingerprint, options)

    return {
      [TOKEN_KEY_NAME.ACCESS_TOKEN]: accessToken,
    }
  }
}
