import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

export const GetUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context)
    if (gqlContext.getType() == 'graphql') {
        const req = gqlContext.getContext()?.req
        return req.user
    }

    if (context.getType() == 'http') {
        const req = context.switchToHttp().getRequest<Request>()
        return req.user
    }
})