import { IsEnum, IsNumber, IsOptional, Max, Min } from "class-validator";
import { PaginationDto } from "@app/common";
import { ArgsType, Field } from "@nestjs/graphql";
import { RATING, SORT_PRODUCT } from "../common";
import { Type } from "class-transformer";

@ArgsType()
export class SortQueryDto extends PaginationDto {
    @IsEnum(SORT_PRODUCT)
    @IsOptional()
    @Field(() => String, { nullable: true, defaultValue: SORT_PRODUCT.ON_SALE })
    sort?: SORT_PRODUCT
}

@ArgsType()
export class RatingQueryDto extends SortQueryDto {
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(Number(RATING.MIN))
    @Max(Number(RATING.MAX))
    @Field(() => String, { nullable: true, defaultValue: RATING.MAX })
    rating?: number;
}