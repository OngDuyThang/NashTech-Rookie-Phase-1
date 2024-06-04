import { CanActivate, ExecutionContext, Inject, Injectable, MethodNotAllowedException, RequestTimeoutException, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ERROR_MESSAGE } from "../enums/messages";
import { SERVICE_MESSAGE, SERVICE_NAME } from "../enums/rmq";
import { ClientProxy } from "@nestjs/microservices";
import { TimeoutError, catchError, tap, timeout } from "rxjs";
import { TPermissionRequest } from "../types/permission-request";
import { COMMON_KEY_NAME } from "../enums/token";
import { convertRpcException } from "../utils/helpers";
import { UserEntity } from "../entities/user.entity";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class PermissionRequestGuard implements CanActivate {
    constructor(
        @Inject(SERVICE_NAME.AUTH_SERVICE)
        private readonly authService: ClientProxy
    ) {}

    private getTokenAndFingerprint(
        context: ExecutionContext
    ): TPermissionRequest {
        if (context.getType() == 'rpc') {
            throw new MethodNotAllowedException(ERROR_MESSAGE.METHOD_NOT_ALLOWED)
        }

        // Check if Graphql request to get correct request object
        const gqlContext = GqlExecutionContext.create(context)
        const req = gqlContext.getType() == 'graphql' ?
            gqlContext.getContext()?.req :
            context.switchToHttp().getRequest<Request>()

        // Http request: get bearer token from headers and fingerprint from cookie
        const accessToken = req?.headers?.authorization?.split(' ')[1]
        const fingerprint = req?.cookies?.[COMMON_KEY_NAME.FINGERPRINT]
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
        const gqlContext = GqlExecutionContext.create(context)
        const req = gqlContext.getType() == 'graphql' ?
            gqlContext.getContext().req :
            context.switchToHttp().getRequest<Request>()

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
            timeout(10000),
            catchError(e => {
                if (e instanceof TimeoutError) {
                    throw new RequestTimeoutException(ERROR_MESSAGE.TIME_OUT)
                }
                throw convertRpcException(e)
            })
        )
    }
}