import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { Request, Response } from 'express';
import { Env } from '@app/env';
import { NODE_ENV } from '../enums/node-env';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly env: Env,
  ) {}

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    if ((gqlHost.getType() as string) == 'graphql') {
      return;
    }

    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const code = (exception as any).code;
    const message = exception.message;
    const stack = exception.stack;

    let status: number;
    switch (code) {
      case '23505':
        status = 409;
        break;
      case '42501':
        status = 403;
        break;
      case '42703':
        status = 404;
        break;
      default:
        status = 500;
        break;
    }

    const { method, originalUrl: url } = req;
    this.logger.error(
      `Method: ${method} | URI: ${url} | Status: ${status} | Message: ${message}`,
    );

    res.status(status).send({
      data: null,
      message,
      statusCode: status,
      ...(this.env.NODE_ENV == NODE_ENV.DEVELOPMENT ? { stack } : null),
    });
  }
}
