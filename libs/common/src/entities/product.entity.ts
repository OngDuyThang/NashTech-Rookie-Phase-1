import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProductEntity extends AbstractEntity {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Field()
    title: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field()
    price: number;

    @IsNumber()
    @IsOptional()
    @Field({ nullable: true })
    discount?: number

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    image?: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    author?: string
}