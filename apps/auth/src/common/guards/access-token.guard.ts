import { ERROR_MESSAGE } from "@app/common";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(e: any, user: any, _info: any, context: ExecutionContext, _status: any) {
        if (e || !user) {
            const error = new UnauthorizedException(ERROR_MESSAGE.USER_UNAUTHORIZED)
            const type = context.getType()

            if (type == 'http') {
                throw error
            }

            if (type == 'rpc') {
                throw new RpcException(error)
            }

            throw e
        }

        delete user.password
        return user
    }
}