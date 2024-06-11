import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateOtpDto {
  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
