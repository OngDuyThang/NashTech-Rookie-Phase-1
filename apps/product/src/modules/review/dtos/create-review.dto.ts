import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString, IsString, IsUUID, MaxLength } from "class-validator";

@InputType()
export class CreateReviewDto {
    @IsNumberString()
    @IsNotEmpty()
    @Field(() => String)
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