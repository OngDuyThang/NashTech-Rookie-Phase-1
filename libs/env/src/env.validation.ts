import { classValidate } from "@app/common";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

// Abstract here
export class EnvValidation {
    @IsString()
    @IsNotEmpty()
    NODE_ENV: string

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
    DB_HOST: string

    @IsNumberString()
    @IsNotEmpty()
    DB_PORT: string

    @IsString()
    @IsNotEmpty()
    DB_USERNAME: string

    @IsString()
    @IsNotEmpty()
    DB_PASSWORD: string

    @IsString()
    @IsNotEmpty()
    DB_NAME: string
}

const validateEnv = (config: Record<string, unknown>) => {
    return classValidate(EnvValidation, config)
}

export default validateEnv