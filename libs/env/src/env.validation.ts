import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsNumberString, IsString, validateSync } from "class-validator";

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

export default function validateEnv(config: Record<string, unknown>) {
    const object = plainToInstance(EnvValidation, config, {
        enableImplicitConversion: true
    })

    const errors = validateSync(object, {
        skipMissingProperties: false
    })

    if (errors.length) {
        throw new Error(errors.toString())
    }

    return object
}