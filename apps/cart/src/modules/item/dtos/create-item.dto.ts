import { Field, InputType } from "@nestjs/graphql"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator"

@InputType()
export class CreateItemDto {
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    product_id: string

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Field(() => String, { defaultValue: '1' })
    quantity?: number
}