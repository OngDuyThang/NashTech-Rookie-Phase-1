import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreatePromotionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    discount_percent: number;
}