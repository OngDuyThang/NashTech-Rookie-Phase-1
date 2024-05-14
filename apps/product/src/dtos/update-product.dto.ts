import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID(4)
    @IsNotEmpty()
    sub_cat_id: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}