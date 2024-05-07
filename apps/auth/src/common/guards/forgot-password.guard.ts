import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { classValidate } from "@app/common";
import { ForgotPasswordDto } from "../dtos";
import { UserService } from "../../modules/user";

@Injectable()
export class ForgotPasswordGuard implements CanActivate {
    constructor(
        private readonly userService: UserService
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();

        const { email } = classValidate(ForgotPasswordDto, req.body)
        const user = await this.userService.findOne(email)
        delete user.password
        req.user = user

        return true
    }
}