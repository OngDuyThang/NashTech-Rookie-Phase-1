import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ORDER_STATUS, PAYMENT_STATUS } from '../common';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class UpdateOrderDto {
  @IsUUID(4)
  @IsOptional()
  @Field(() => String, { nullable: false })
  orderId?: string;

  @IsEnum(ORDER_STATUS)
  @IsOptional()
  status?: ORDER_STATUS;

  @IsEnum(PAYMENT_STATUS)
  @IsOptional()
  @Field(() => String, { nullable: false })
  payment_status?: PAYMENT_STATUS;
}
