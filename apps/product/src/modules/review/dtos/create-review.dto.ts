import { Field, InputType, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

@InputType()
export class CreateReviewDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    @Field(() => Int)
    rating: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Field()
    title: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    description: string;

    // UserEntity from token

    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    product_id: string;
}