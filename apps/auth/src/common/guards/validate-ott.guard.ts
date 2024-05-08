import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";
import { UserEntity, UserService } from "../../modules/user";
import { AuthService } from "../../auth.service";
import { ERROR_MESSAGE } from "@app/common";
import { ResetPasswordDto } from "../dtos";

@Injectable()
export class ValidateOttGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        const user = req.user as UserEntity;

        const { newPassword, confirmPassword } = req.body as ResetPasswordDto
        if (newPassword != confirmPassword) {
            throw new BadRequestException(ERROR_MESSAGE.PASSWORD_NOT_MATCH)
        }

        const isMatch = await this.authService.validateOneTimeToken(
            req.cookies?.['hashed-one-time-token'],
            user.oneTimeToken
        );
        if (!isMatch) {
            throw new ForbiddenException(ERROR_MESSAGE.UNAUTHORIZED)
        }
        await this.userService.updateOneTimeToken(user.id, null)

        return true
    }
}