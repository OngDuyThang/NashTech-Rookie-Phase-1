import { PROMOTION_CONDITION, PROMOTION_LEVEL } from '@app/common';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PROMOTION_LEVEL)
  @IsNotEmpty()
  level: PROMOTION_LEVEL;

  @IsEnum(PROMOTION_CONDITION)
  @IsNotEmpty()
  condition: PROMOTION_CONDITION;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  min_value?: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  discount_percent: number;

  @IsString()
  @IsOptional()
  image?: string;
}
