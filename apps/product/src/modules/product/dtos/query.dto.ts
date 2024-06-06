import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { PaginationDto } from "@app/common";
import { ArgsType, Field, Int } from "@nestjs/graphql";
import { RATING, PRODUCT_SORT } from "../common";

@ArgsType()
export class ProductQueryDto extends PaginationDto {
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Field(() => [String], { nullable: true })
    categoryIds?: string[]

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Field(() => [String], { nullable: true })
    authorIds?: string[]

    @IsArray()
    @IsNumber({}, { each: true })
    @Min(RATING.MIN, { each: true })
    @Max(RATING.MAX, { each: true })
    @IsOptional()
    @Field(() => [Int], { nullable: true })
    ratings?: number[]

    @IsEnum(PRODUCT_SORT)
    @IsOptional()
    @Field(() => String, { nullable: true, defaultValue: PRODUCT_SORT.ON_SALE })
    sort?: PRODUCT_SORT
}

