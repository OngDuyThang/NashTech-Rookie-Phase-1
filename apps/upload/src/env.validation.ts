import { IsNotEmpty, IsNumberString, IsString } from "class-validator"

export class EnvValidation {
    @IsString()
    @IsNotEmpty()
    SERVICE_HOST_NAME: string

    @IsNumberString()
    @IsNotEmpty()
    SERVICE_PORT: string

    @IsString()
    @IsNotEmpty()
    RABBIT_MQ_URI: string

    @IsString()
    @IsNotEmpty()
    AUTH_QUEUE: string

    @IsString()
    @IsNotEmpty()
    PRODUCT_QUEUE: string

    @IsString()
    @IsNotEmpty()
    AWS_S3_REGION: string

    @IsString()
    @IsNotEmpty()
    AWS_S3_BUCKET: string

    @IsString()
    @IsNotEmpty()
    AWS_ACCESS_KEY: string

    @IsString()
    @IsNotEmpty()
    AWS_SECRET_KEY: string
}