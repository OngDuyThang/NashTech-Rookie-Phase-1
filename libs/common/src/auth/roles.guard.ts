import { CanActivate, ExecutionContext, Injectable, MethodNotAllowedException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { DECORATOR_KEY } from "../enums/decorators";
import { UserEntity } from "./user.entity";
import { ERROR_MESSAGE } from "../enums/messages";
import { ROLE } from "../enums/roles";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext) {
        if (context.getType() == 'rpc') {
            throw new MethodNotAllowedException(ERROR_MESSAGE.METHOD_NOT_ALLOWED)
        }

        const gqlContext = GqlExecutionContext.create(context)
        const req = gqlContext.getType() == 'graphql' ?
            gqlContext.getContext().req :
            context.switchToHttp().getRequest<Request>()

        const roles = this.reflector.getAllAndOverride<string[]>(DECORATOR_KEY.ROLES, [
            context.getHandler(),
            context.getClass()
        ]);

        const user = req.user as UserEntity
        if (user.role == ROLE.ADMIN) {
            return true
        }

        if (!roles.includes(user.role)) {
            throw new UnauthorizedException(ERROR_MESSAGE.USER_UNAUTHORIZED)
        }

        return true
    }
}