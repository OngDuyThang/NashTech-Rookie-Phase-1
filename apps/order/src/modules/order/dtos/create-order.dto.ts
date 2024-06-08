import { Trim } from "@app/common"
import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsString, MaxLength } from "class-validator"
import { PAYMENT_METHOD } from "../common"

@InputType()
export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Trim()
    @Field(() => String, { nullable: false })
    name: string

    @IsNumberString()
    @IsNotEmpty()
    @MaxLength(50)
    @Trim()
    @Field(() => String, { nullable: false })
    phone: string

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    @Trim()
    @Field(() => String, { nullable: false })
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @Trim()
    @Field(() => String, { nullable: false })
    address: string

    @IsEnum(PAYMENT_METHOD)
    @IsNotEmpty()
    @Field(() => String, { nullable: true, defaultValue: PAYMENT_METHOD.COD })
    payment_method: PAYMENT_METHOD
}