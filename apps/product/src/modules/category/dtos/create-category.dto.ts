import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsUUID(4)
    @IsOptional()
    parent_id?: string
}