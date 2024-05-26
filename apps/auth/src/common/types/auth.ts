import { TOKEN_KEY_NAME } from "../enums"

export type TLoginResponse = {
    validateOtpEndpoint: string,
    userId: string
} | {
    clientCallbackUrl: string
}

export type TTokenResponse = {
    [TOKEN_KEY_NAME.ACCESS_TOKEN]: string,
    username?: string,
    email?: string,
    picture?: string
}

export type TEnableTwoFactorResponse = {
    twoFactorSecret: string
}

export type TForgotPasswordResponse = {
    message: string
}

export type TGoogleLoginResponse = {
    email: string,
    verify: string
}