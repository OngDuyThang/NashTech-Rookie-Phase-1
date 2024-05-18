import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map } from "rxjs";
import { Request, Response } from "express";
import { getSuccessMessage } from "../utils/helpers";
import { TResponseDataShape } from "../types/data-shape";
import { GqlExecutionContext } from "@nestjs/graphql";
import { cloneDeep } from "lodash";

@Injectable()
export class ReshapeDataInteceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const gqlContext = GqlExecutionContext.create(context)
        if (gqlContext.getType() == 'graphql') {
            return next.handle()
        }

        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();
        const message = res.statusMessage;
        const statusCode = res.statusCode;

        return next.handle().pipe(
            map((data: any) => {
                const page = Number(req.query?.page)
                const limit = Number(req.query?.limit)
                let total: number

                if (
                    Array.isArray(data) &&
                    data.length == 2 &&
                    Array.isArray(data[0]) &&
                    Number.isInteger(data[1])
                ) {
                    total = data[1]
                    data = cloneDeep(data[0])
                }

                if (total == undefined && Array.isArray(data)) {
                    total = data.length
                }

                const resDataShape: TResponseDataShape = {
                    data: data || null,
                    message: message || getSuccessMessage(statusCode),
                    statusCode,
                    ...(page >= 0 && limit >= 0 && total >= 0 ? {
                        page,
                        limit
                    } : null),
                    ...(total >= 0 ? { total } : null)
                };
                return resDataShape
            })
        );
    }
}