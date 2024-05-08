import { AbstractEnvValidation } from "@app/env"
import { IsNotEmpty, IsString } from "class-validator"

export class EnvValidation extends AbstractEnvValidation {
    @IsString()
    @IsNotEmpty()
    ACCESS_TOKEN_SECRET: string

    @IsString()
    @IsNotEmpty()
    REFRESH_TOKEN_SECRET: string

    @IsString()
    @IsNotEmpty()
    VALIDATE_OTP_ENDPONT: string

    @IsString()
    @IsNotEmpty()
    RESET_PASSWORD_ENDPOINT: string

    @IsString()
    @IsNotEmpty()
    MAILER_USERNAME: string

    @IsString()
    @IsNotEmpty()
    MAILER_PASSWORD: string
}