import { Env } from "@app/env";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile } from "passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { AuthService } from "../../auth.service";

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly env: Env,
        private readonly authService: AuthService
    ) {
        super({
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
            scope: ['profile', 'email'],
        }, (
            req: Request,
            _accessToken: string,
            _refreshToken: string,
            params: {
                access_token: string;
                expires_in: number;
                scope: string;
                token_type: "Bearer";
                id_token: string;
            },
            profile: any,
            done: VerifyCallback
        ) => {
            console.log('access_token: ', params.access_token)
            console.log('id_token: ', params.id_token)
            done(null, profile);
        });
    }
}