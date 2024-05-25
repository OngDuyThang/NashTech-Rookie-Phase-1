import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { CartItemSchema } from "./cart-item.schema";

@ObjectType()
export class CartSchema extends AbstractEntity {
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    user_id: string

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CartItemSchema)
    @Field(() => [CartItemSchema], { nullable: true })
    items?: CartItemSchema[]

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    total?: number
}