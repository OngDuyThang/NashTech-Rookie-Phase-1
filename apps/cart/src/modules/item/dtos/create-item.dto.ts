import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateCartItemDto {
  @IsUUID(4)
  @IsNotEmpty()
  @Field()
  product_id: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Field(() => Int, { defaultValue: 1 })
  quantity?: number;
}
