import { Trim } from '@app/common';
import { OPENID_PROVIDER } from '../../../common/enums';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Trim()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Trim()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Trim()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Trim()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
    {
      message:
        'password must contain 8-30 characters, one uppercase, one lowercase, one number and one special character',
    },
  )
  password: string;

  @IsEnum(OPENID_PROVIDER)
  @IsOptional()
  openid_provider?: OPENID_PROVIDER;
}
