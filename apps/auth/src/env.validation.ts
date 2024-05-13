import { AbstractEnvValidation } from "@app/env"
import { IsNotEmpty, IsNumberString, IsString } from "class-validator"

export class EnvValidation extends AbstractEnvValidation {
    @IsString()
    @IsNotEmpty()
    SERVICE_HOST_NAME: string

    @IsNumberString()
    @IsNotEmpty()
    SERVICE_PORT: string

    @IsString()
    @IsNotEmpty()
    REDIS_HOST: string

    @IsNumberString()
    @IsNotEmpty()
    REDIS_PORT: string

    @IsString()
    @IsNotEmpty()
    REDIS_USERNAME: string

    @IsString()
    @IsNotEmpty()
    REDIS_PASSWORD: string

    @IsString()
    @IsNotEmpty()
    ACCESS_TOKEN_SECRET: string

    @IsString()
    @IsNotEmpty()
    REFRESH_TOKEN_SECRET: string

    @IsString()
    @IsNotEmpty()
    VALIDATE_OTP_PATH_NAME: string

    @IsString()
    @IsNotEmpty()
    RESET_PASSWORD_PATH_NAME: string

    @IsString()
    @IsNotEmpty()
    MAILER_USERNAME: string

    @IsString()
    @IsNotEmpty()
    MAILER_PASSWORD: string

    @IsString()
    @IsNotEmpty()
    GOOGLE_CLIENT_ID: string

    @IsString()
    @IsNotEmpty()
    GOOGLE_CLIENT_SECRET: string

    @IsString()
    @IsNotEmpty()
    GOOGLE_CALLBACK_URL: string

    @IsString()
    @IsNotEmpty()
    GOOGLE_ISSUER: string
}