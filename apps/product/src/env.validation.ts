import { AbstractEnvValidation } from '@app/env';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class EnvValidation extends AbstractEnvValidation {
  @IsString()
  @IsNotEmpty()
  SERVICE_HOST_NAME: string;

  @IsNumberString()
  @IsNotEmpty()
  SERVICE_PORT: string;

  @IsString()
  @IsNotEmpty()
  AUTH_QUEUE: string;

  @IsString()
  @IsNotEmpty()
  PRODUCT_QUEUE: string;

  @IsString()
  @IsNotEmpty()
  CART_QUEUE: string;

  @IsString()
  @IsNotEmpty()
  ORDER_QUEUE: string;
}
