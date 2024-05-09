import { Env } from "@app/env";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { NODE_ENV } from "../enums/node-env";

@Catch(Error)
export class ErrorInstanceFilter implements ExceptionFilter {
    constructor(
        private readonly logger: Logger,
        private readonly env: Env
    ) {}

    catch(exception: Error, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const req = context.getRequest<Request>()
        const res = context.getResponse<Response>()

        const status = 500
        const message = exception.message
        const stack = exception.stack

        const { method, originalUrl: url } = req
        this.logger.error(`Method: ${method} | URI: ${url} | Status: ${status} | Message: ${message}`)

        res.status(status).send({
            statusCode: status,
            message,
            ...(this.env.NODE_ENV == NODE_ENV.DEVELOPMENT ? { stack } : null)
        })
    }
}