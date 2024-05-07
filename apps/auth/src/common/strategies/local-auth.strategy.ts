import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../../auth.service";
import { UserEntity } from "../../modules/user/entities/user.entity";

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super();
    }

    async validate(
        usernameOrEmail: string,
        password: string
    ): Promise<UserEntity> {
        const user = await this.authService.validateCredential(
            usernameOrEmail,
            password
        )
        delete user.password
        return user
    }
}