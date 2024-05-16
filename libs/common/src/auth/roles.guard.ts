import { CanActivate, ExecutionContext, Injectable, MethodNotAllowedException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { DECORATOR_KEY } from "../enums/decorators";
import { UserEntity } from "./user.entity";
import { ERROR_MESSAGE } from "../enums/messages";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext) {
        if (context.getType() != 'http') {
            throw new MethodNotAllowedException(ERROR_MESSAGE.METHOD_NOT_ALLOWED)
        }

        const req = context.switchToHttp().getRequest<Request>();
        const roles = this.reflector.getAllAndOverride<string[]>(DECORATOR_KEY.ROLES, [
            context.getHandler(),
            context.getClass()
        ]);

        const user = req.user as UserEntity
        if (!roles.includes(user.role)) {
            throw new UnauthorizedException(ERROR_MESSAGE.USER_UNAUTHORIZED)
        }

        return true
    }
}