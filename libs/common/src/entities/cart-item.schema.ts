import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductSchema } from "@app/common";

@ObjectType()
export class CartItemSchema extends AbstractEntity {
    @IsUUID(4)
    @IsNotEmpty()
    product_id: string

    @Type(() => ProductSchema)
    @IsOptional()
    @Field(() => ProductSchema, { nullable: true })
    product?: ProductSchema

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field(() => String, { nullable: true, defaultValue: '1' })
    quantity: number

    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    cart_id: string
}