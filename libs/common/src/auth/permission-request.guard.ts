import { CanActivate, ExecutionContext, HttpException, Inject, Injectable, MethodNotAllowedException, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ERROR_MESSAGE } from "../enums/messages";
import { SERVICE_MESSAGE, SERVICE_NAME } from "../enums/rmq";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, tap } from "rxjs";
import { TPermissionRequest } from "../types/permission-request";
import { COOKIE_KEY_NAME } from "../enums/cookie";
import { convertRpcException } from "../utils/helpers";
import { UserEntity } from "./user.entity";

@Injectable()
export class PermissionRequestGuard implements CanActivate {
    constructor(
        @Inject(SERVICE_NAME.AUTH_SERVICE)
        private readonly authService: ClientProxy
    ) {}

    private getTokenAndFingerprint(
        context: ExecutionContext
    ): TPermissionRequest {
        if (context.getType() != 'http') {
            throw new MethodNotAllowedException(ERROR_MESSAGE.METHOD_NOT_ALLOWED)
        }

        // Http request: get bearer token from headers and fingerprint from cookie
        const req = context.switchToHttp().getRequest<Request>()
        const accessToken = req?.headers?.authorization.split(' ')[1]
        const fingerprint = req?.cookies?.[COOKIE_KEY_NAME.FINGERPRINT]
        if (!accessToken || !fingerprint) {
            throw new UnauthorizedException(ERROR_MESSAGE.USER_UNAUTHORIZED)
        }
        return {
            accessToken,
            fingerprint
        }
    }

    private attachUserInRequest(
        context: ExecutionContext,
        user: UserEntity
    ): void {
        const req = context.switchToHttp().getRequest<Request>()
        req.user = user
    }

    // single responsibility: send access token and fingerprint to receive user entity, then attach to request object
    canActivate(context: ExecutionContext) {
        const { accessToken, fingerprint } = this.getTokenAndFingerprint(context);
        const payload: TPermissionRequest = {
            accessToken,
            fingerprint
        }

        return this.authService.send(
            { cmd: SERVICE_MESSAGE.VALIDATE_JWT },
            payload
        ).pipe(
            tap(resUser => { this.attachUserInRequest(context, resUser) }),
            catchError(e => { throw convertRpcException(e) })
        )
    }
}