import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsOptional()
    image?: string;

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