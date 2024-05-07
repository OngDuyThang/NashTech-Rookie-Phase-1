import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "../../auth.service";
import { classValidate } from "@app/common";
import { ValidateOtpDto } from "../dtos/validate-otp.dto";

@Injectable()
export class ValidateOtpGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();

        const { otp, userId } = classValidate(ValidateOtpDto, req.body)
        const user = await this.authService.validateOtp(otp, userId, res)
        req.user = user

        return true
    }
}