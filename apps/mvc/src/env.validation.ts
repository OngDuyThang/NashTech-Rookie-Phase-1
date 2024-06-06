import { IsNotEmpty, IsString } from "class-validator"

export class EnvValidation {
    @IsString()
    @IsNotEmpty()
    PORT: string

    @IsString()
    @IsNotEmpty()
    METHOD: string

    @IsString()
    @IsNotEmpty()
    AUTH_SERVICE_HOST_NAME: string

    @IsString()
    @IsNotEmpty()
    AUTH_SERVICE_PORT: string

    @IsString()
    @IsNotEmpty()
    PRODUCT_SERVICE_HOST_NAME: string

    @IsString()
    @IsNotEmpty()
    PRODUCT_SERVICE_PORT: string

    @IsString()
    @IsNotEmpty()
    CART_SERVICE_HOST_NAME: string

    @IsString()
    @IsNotEmpty()
    CART_SERVICE_PORT: string

    @IsString()
    @IsNotEmpty()
    ORDER_SERVICE_HOST_NAME: string

    @IsString()
    @IsNotEmpty()
    ORDER_SERVICE_PORT: string

    @IsString()
    @IsNotEmpty()
    UPLOAD_SERVICE_HOST_NAME: string

    @IsString()
    @IsNotEmpty()
    UPLOAD_SERVICE_PORT: string

    @IsString()
    @IsNotEmpty()
    ASSET_SERVICE_HOST_NAME: string

    @IsString()
    @IsNotEmpty()
    ASSET_SERVICE_PORT: string
}