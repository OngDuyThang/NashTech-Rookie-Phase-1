import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { SUCCESS_CODE } from '../enums/codes';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: (error?: any) => void) {
    const start = new Date().getTime();
    const { method, originalUrl: url } = req;

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      const end = new Date().getTime();

      if (
        statusCode == SUCCESS_CODE.OK ||
        statusCode == SUCCESS_CODE.CREATED ||
        statusCode == SUCCESS_CODE.NO_CONTENT
      ) {
        this.logger.log(
          `Method: ${method} | URI: ${url} | Status: ${statusCode} | Message: ${statusMessage} | Time: ${end - start}ms`,
        );
      }
    });

    next();
  }
}
