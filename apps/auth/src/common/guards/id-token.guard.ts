import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { TOKEN_KEY_NAME } from "../enums";
import { AuthService } from "../../auth.service";

@Injectable()
export class IdTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        const idToken = req.cookies?.[TOKEN_KEY_NAME.GOOGLE_ID_TOKEN]

        await this.authService.validateGoogleIdToken(idToken)
        return true
    }
}