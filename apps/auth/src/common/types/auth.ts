export type TLoginResponse = {
    validateOtpEndpoint: string,
    userId: string
} | {
    'access-token': string
}

export type TEnableTwoFactorResponse = {
    twoFactorSecret: string
}

export type TForgotPasswordResponse = {
    message: string
}