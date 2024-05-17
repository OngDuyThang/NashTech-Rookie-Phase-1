import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map } from "rxjs";
import { Response } from "express";
import { getSuccessMessage } from "../utils/helpers";
import { TResponseDataShape } from "../types/data-shape";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class ReshapeDataInteceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const gqlContext = GqlExecutionContext.create(context)
        if (gqlContext.getType() == 'graphql') {
            return next.handle()
        }

        const res = context.switchToHttp().getResponse<Response>();
        const message = res.statusMessage;
        const statusCode = res.statusCode;

        return next.handle().pipe(
            map((data: any) => {
                const resDataShape: TResponseDataShape = {
                    data: data || null,
                    message: message || getSuccessMessage(statusCode),
                    statusCode
                };
                return resDataShape
            })
        );
    }
}