import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../../auth.service";

@Injectable()
export class ForgotPasswordGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) {}

    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

    }
}