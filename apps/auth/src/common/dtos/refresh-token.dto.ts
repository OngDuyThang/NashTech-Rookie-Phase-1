import { IsNotEmpty, IsString } from 'class-validator';
import { TOKEN_KEY_NAME } from '../enums';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  [TOKEN_KEY_NAME.ACCESS_TOKEN]: string;
}
