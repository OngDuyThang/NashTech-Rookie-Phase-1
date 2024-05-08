import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUsernameDto {
    @IsString()
    @IsNotEmpty()
    usernameOrEmail: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginEmailDto {
    @IsEmail()
    @IsNotEmpty()
    usernameOrEmail: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}