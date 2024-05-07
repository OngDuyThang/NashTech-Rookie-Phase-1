import { Trim } from "@app/common"
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator"

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Trim()
    username: string

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
        message: 'password must contain 8-15 characters, one uppercase, one lowercase, one number and one special character'
    })
    password: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Trim()
    first_name: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Trim()
    last_name: string

    @IsEmail()
    @IsNotEmpty()
    @Trim()
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @Trim()
    phone: string

    // address: string
}