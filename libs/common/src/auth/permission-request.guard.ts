import { CanActivate, ExecutionContext, HttpException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ERROR_MESSAGE } from "../enums/messages";
import { SERVICE_MESSAGE, SERVICE_NAME } from "../enums/rmq";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, tap } from "rxjs";
import { TPermissionRequest } from "../types/permission-request";
import { COOKIE_KEY_NAME } from "../enums/cookie";
import { convertRpcException } from "../utils/helpers";

@Injectable()
export class PermissionRequestGuard implements CanActivate {
    constructor(
        @Inject(SERVICE_NAME.AUTH_SERVICE)
        private readonly authService: ClientProxy
    ) {}

    private getTokenAndFingerprint(
        context: ExecutionContext
    ): TPermissionRequest {
        const error = new UnauthorizedException(ERROR_MESSAGE.USER_UNAUTHORIZED)

        // Http request: get bearer token from headers and fingerprint from cookie
        if (context.getType() == 'http') {
            const req = context.switchToHttp().getRequest<Request>()
            const accessToken = req?.headers?.authorization.split(' ')[1]
            const fingerprint = req?.cookies?.[COOKIE_KEY_NAME.FINGERPRINT]
            if (!accessToken || !fingerprint) {
                throw error
            }
            return {
                accessToken,
                fingerprint
            }
        }

        // Rpc: get access token and fingerprint in payload object
        if (context.getType() == 'rpc') {
            const req = context.switchToRpc().getData()
            const accessToken = req?.accessToken
            const fingerprint = req?.fingerprint
            if (!accessToken || !fingerprint) {
                throw error
            }
            return {
                accessToken,
                fingerprint
            }
        }
    }

    private attachUserInRequest(
        context: ExecutionContext,
        user: any
    ): void {
        // Attach user in http request object
        if (context.getType() == 'http') {
            const req = context.switchToHttp().getRequest<Request>()
            req.user = user
        }

        // Attach user in rpc payload object
        if (context.getType() == 'rpc') {
            const req = context.switchToRpc().getData()
            req.user = user
        }
    }

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