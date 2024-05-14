import { IsNotEmpty, IsNumberString, IsString } from "class-validator";
export abstract class AbstractEnvValidation {
    @IsString()
    @IsNotEmpty()
    NODE_ENV: string

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

    @IsString()
    @IsNotEmpty()
    RABBIT_MQ_URI: string

    @IsString()
    @IsNotEmpty()
    QUEUE_NAME: string
}