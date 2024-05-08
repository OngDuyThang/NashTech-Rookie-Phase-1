import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { classValidate } from "@app/common";
import { ForgotPasswordDto } from "../dtos";
import { UserService } from "../../modules/user";
import { AuthService } from "../../auth.service";

@Injectable()
export class ForgotPasswordGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();

        const { email } = classValidate(ForgotPasswordDto, req.body)
        const user = await this.userService.findOne(email)
        delete user.password

        const result = await this.authService.forgotPassword(user.id, email)
        req.user = result

        return true
    }
}