import { Env } from "@app/env";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { NODE_ENV } from "../enums/node-env";
import { GqlArgumentsHost } from "@nestjs/graphql";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly logger: Logger,
        private readonly env: Env
    ) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host)
        if (gqlHost.getType() as string == 'graphql') {
            return
        }

        const context = host.switchToHttp()
        const req = context.getRequest<Request>()
        const res = context.getResponse<Response>()

        const status = exception.getStatus()
        const message = exception.message

        const detail = (exception.getResponse() as any)?.message
        const stack = exception.stack

        const { method, originalUrl: url } = req
        this.logger.error(`Method: ${method} | URI: ${url} | Status: ${status} | Message: ${message} | Detail: ${detail}`)

        res.status(status).send({
            data: null,
            message,
            statusCode: status,
            detail,
            ...(this.env.NODE_ENV == NODE_ENV.DEVELOPMENT ? { stack } : null)
        })
    }
}