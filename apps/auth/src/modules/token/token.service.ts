import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user';
import { TJwtPayload } from '../../common/types';
import { Response, CookieOptions } from 'express';
import { NODE_ENV } from '@app/common';
import { Env } from '@app/env';
import { JwtService } from '@nestjs/jwt';
import { COOKIE_KEY } from '../../common/enums';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly env: Env,
  ) {}

  generateTokenPayload(
    user: UserEntity
  ): TJwtPayload {
    const { id, username, email } = user;
    return {
      id,
      username,
      email,
    };
  }

  generateTokens(
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
    res: Response
  ): void {
    const options: CookieOptions = {
      httpOnly: true,
      sameSite: 'none',
      secure: this.env.NODE_ENV == NODE_ENV.DEVELOPMENT ? false : true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie(COOKIE_KEY.ACCESS_TOKEN, accessToken, options);
    res.cookie(COOKIE_KEY.REFRESH_TOKEN, refreshToken, options);
  }
}
