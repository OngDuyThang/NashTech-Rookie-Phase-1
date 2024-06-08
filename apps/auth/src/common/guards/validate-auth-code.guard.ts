import { ERROR_MESSAGE, classValidate } from "@app/common";
import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ExchangeTokenDto } from "../dtos";
import { CACHE_SERVICE } from "@app/cache";
import { Cache } from "cache-manager";
import { UserService } from "../../modules/user";

@Injectable()
export class ValidateAuthCodeGuard implements CanActivate {
    constructor(
        @Inject(CACHE_SERVICE)
        private readonly cacheService: Cache,
        private readonly userService: UserService
    ) {}

    async canActivate(context: ExecutionContext) {
        const error = new UnauthorizedException(ERROR_MESSAGE.UNAUTHORIZED)
        try {
            const req = context.switchToHttp().getRequest<Request>();
            const { authCode } = classValidate(ExchangeTokenDto, req.body)

            const userId = await this.cacheService.get<string>(authCode);
            console.log(userId)
            if (!userId) {
                throw error
            }

            const user = await this.userService.findOneById(userId)
            delete user.password
            req.user = user

            // clear cache auth code when user navigate successfully
            await this.cacheService.del(authCode)

            return true;
        } catch (e) {
            if (
                e instanceof BadRequestException ||
                e instanceof NotFoundException
            ) {
                throw error
            }
            throw e
        }
    }
}