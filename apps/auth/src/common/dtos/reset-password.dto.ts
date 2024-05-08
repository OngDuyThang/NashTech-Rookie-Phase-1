import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from "class-validator";

export class ResetPasswordDto {
    @IsUUID(4)
    @IsNotEmpty()
    id: string

    @IsString()
    @IsOptional()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/, {
        message: 'password must contain 8-30 characters, one uppercase, one lowercase, one number and one special character'
    })
    newPassword?: string

    @IsString()
    @IsOptional()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/, {
        message: 'password must contain 8-30 characters, one uppercase, one lowercase, one number and one special character'
    })
    confirmPassword?: string
}