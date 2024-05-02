import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    username: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    first_name: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    last_name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    phone: string

    // address: string
}