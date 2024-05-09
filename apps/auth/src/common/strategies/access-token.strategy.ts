import { Env } from "@app/env";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TJwtPayload } from "../types";
import { ERROR_MESSAGE } from "@app/common";
import { Request } from "express";
import { UserEntity, UserService } from "../../modules/user";
import * as bcrypt from 'bcrypt';
import { TOKEN_KEY_NAME } from "../enums";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly env: Env,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: env.ACCESS_TOKEN_SECRET,
            passReqToCallback: true
        });
    }

    async validate(
        req: Request,
        payload: TJwtPayload
    ): Promise<UserEntity> {
        const error = new UnauthorizedException(ERROR_MESSAGE.USER_UNAUTHORIZED)

        if (!Object.keys(payload).length)
            throw error

        const originalFingerprint = req.cookies?.[TOKEN_KEY_NAME.FINGERPRINT]
        const { id, fingerprint: hashedFingerprint } = payload

        try {
            const user = await this.userService.findOneById(id)
            const isMatch = await bcrypt.compare(originalFingerprint, hashedFingerprint)

            if (!isMatch) {
                throw error
            }

            delete user.password
            return user
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw error
            }
            throw e
        }
    }
}