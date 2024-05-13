import { Env } from "@app/env";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { TGoogleLoginResponse } from "../types";

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly env: Env
    ) {
        super({
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
            scope: ['profile', 'email'],
        }, async (
            _req: Request,
            _accessToken: string,
            _refreshToken: string,
            _params: {
                access_token: string;
                expires_in: number;
                scope: string;
                token_type: "Bearer";
                id_token: string;
            },
            profile: any,
            done: VerifyCallback
        ) => {
            const res: TGoogleLoginResponse = {
                email: profile?.email,
                verify: profile?.verified
            }
            done(null, res);
        });
    }
}