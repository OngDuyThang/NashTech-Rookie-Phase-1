import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateAuthorDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    pen_name: string
}