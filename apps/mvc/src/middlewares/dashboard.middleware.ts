import { COMMON_KEY_NAME, getUrlEndpoint } from '@app/common';
import { Env } from '@app/env';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class DashboardMiddleware implements NestMiddleware {
  constructor(private readonly env: Env) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const fingerprint = req?.cookies?.[COMMON_KEY_NAME.FINGERPRINT];
    const refreshToken = req?.cookies?.[COMMON_KEY_NAME.REFRESH_TOKEN];
    const loginEndpoint = getUrlEndpoint(
      this.env.AUTH_SERVICE_HOST_NAME,
      this.env.AUTH_SERVICE_PORT,
      '/auth/dashboard-login',
    );

    if (!fingerprint || !refreshToken) {
      return res.redirect(loginEndpoint);
    }

    next();
  }
}
