import { IsEnum, IsNumber, IsOptional, Max, Min } from "class-validator";
import { PaginationDto } from "@app/common";
import { ArgsType, Field, Float } from "@nestjs/graphql";
import { RATING, PRODUCT_SORT } from "../common";
import { Type } from "class-transformer";

@ArgsType()
export class SortQueryDto extends PaginationDto {
    @IsEnum(PRODUCT_SORT)
    @IsOptional()
    @Field(() => String, { nullable: true, defaultValue: PRODUCT_SORT.ON_SALE })
    sort?: PRODUCT_SORT
}

@ArgsType()
export class RatingQueryDto extends SortQueryDto {
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(Number(RATING.MIN))
    @Max(Number(RATING.MAX))
    @Field(() => Float, { nullable: true, defaultValue: RATING.MAX })
    rating?: number;
}