import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const GetUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    return req.user;
})