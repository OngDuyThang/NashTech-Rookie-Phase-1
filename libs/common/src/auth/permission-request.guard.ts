import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ERROR_MESSAGE } from "../enums/messages";
import { TOKEN_KEY_NAME } from "apps/auth/src/common/enums";
import { UserEntity } from "apps/auth/src/modules/user";
import { SERVICE_MESSAGE, SERVICE_NAME } from "../enums/rmq";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, tap } from "rxjs";
import { TPermissionRequest } from "../types/permission-request";

@Injectable()
export class PermissionRequestGuard implements CanActivate {
    constructor(
        @Inject(SERVICE_NAME.AUTH_SERVICE)
        private readonly authService: ClientProxy
    ) {}

    private getTokenAndFingerprint(
        context: ExecutionContext
    ): TPermissionRequest {
        console.log('get access token', context.getType())
        const error = new UnauthorizedException(ERROR_MESSAGE.USER_UNAUTHORIZED)

        if (context.getType() == 'http') {
            const req = context.switchToHttp().getRequest<Request>()
            const bearerToken = req?.headers?.authorization
            const fingerprint = req?.cookies?.[TOKEN_KEY_NAME.FINGERPRINT]
            if (!bearerToken || !fingerprint) {
                throw error
            }
            return {
                accessToken: bearerToken,
                fingerprint
            }
        }

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
        user: UserEntity
    ): void {
        console.log('receive user', context.getType())
        if (context.getType() == 'http') {
            const req = context.switchToHttp().getRequest<Request>()
            req.user = user
        }

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
            catchError(e => { throw e })
        )
    }
}