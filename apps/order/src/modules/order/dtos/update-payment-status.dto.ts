import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { PAYMENT_STATUS } from "../common";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdatePaymentStatusDto {
    @IsUUID(4)
    @IsOptional()
    @Field(() => String, { nullable: false })
    orderId?: string

    @IsEnum(PAYMENT_STATUS)
    @IsNotEmpty()
    @Field(() => String, { nullable: false })
    payment_status: PAYMENT_STATUS
}