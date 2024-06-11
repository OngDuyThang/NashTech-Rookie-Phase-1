import { IsEnum, IsNotEmpty } from 'class-validator';
import { STATUS } from '../enums/status';

export class ChangeStatusDto {
  @IsEnum(STATUS)
  @IsNotEmpty()
  status: STATUS;
}
