import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map } from "rxjs";
import { Request, Response } from "express";
import { getSuccessMessage } from "../utils/helpers";
import { TGqlDataShape, TResponseDataShape } from "../types/data-shape";
import { GqlExecutionContext } from "@nestjs/graphql";
import { cloneDeep } from "lodash";

@Injectable()
export class ReshapeDataInteceptor implements NestInterceptor {

    // Only allow findList with pagination for client side
    private graphqlReshape(context: GqlExecutionContext, next: CallHandler) {
        const args = context.getArgs()

        const page = args?.page
        const limit = args?.limit

        return next.handle().pipe(
            map((data: any) => {
                const total = data?.total

                const gqlDataShape: TGqlDataShape = {
                    data: cloneDeep(data?.data),
                    ...(page >= 0 && limit >= 0 && total >= 0 ? {
                        page,
                        limit,
                        total
                    } : null)
                }
                return gqlDataShape
            })
        )
    }

    intercept(context: ExecutionContext, next: CallHandler) {
        const gqlContext = GqlExecutionContext.create(context)
        if (gqlContext.getType() == 'graphql') {
            return this.graphqlReshape(gqlContext, next)
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

                // If the data came from findList method with pagination
                // then we need total of records
                if (
                    Array.isArray(data) &&
                    data.length == 2 &&
                    Array.isArray(data[0]) &&
                    Number.isInteger(data[1])
                ) {
                    total = data[1]
                    data = cloneDeep(data[0])
                }

                // If the data came from findAll method
                // then total is length
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