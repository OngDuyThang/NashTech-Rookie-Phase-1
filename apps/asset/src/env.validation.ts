import { AbstractEnvValidation } from "@app/env"
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class EnvValidation extends AbstractEnvValidation {
    @IsString()
    @IsNotEmpty()
    SERVICE_HOST_NAME: string

    @IsNumberString()
    @IsNotEmpty()
    SERVICE_PORT: string

    @IsString()
    @IsOptional()
    ABOUT_PAGE_ID?: string

    @IsString()
    @IsNotEmpty()
    AUTH_QUEUE: string
}