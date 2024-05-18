import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsUUID(4)
    @IsOptional()
    author_id?: string;

    @IsUUID(4)
    @IsOptional()
    category_id?: string;

    @IsUUID(4)
    @IsOptional()
    promotion_id?: string;
}