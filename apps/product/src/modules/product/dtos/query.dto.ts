import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { PaginationDto } from "@app/common";
import { ArgsType, Field } from "@nestjs/graphql";
import { RATING, SORT } from "../common";
import { Type } from "class-transformer";

@ArgsType()
export class SortQueryDto extends PaginationDto {
    @IsEnum(SORT)
    @IsNotEmpty()
    @Field(() => String, { nullable: true, defaultValue: SORT.ON_SALE })
    sort: SORT
}

@ArgsType()
export class RatingQueryDto extends SortQueryDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    @Min(Number(RATING.MIN))
    @Max(Number(RATING.MAX))
    @Field(() => String, { nullable: true, defaultValue: RATING.MAX })
    rating: number;
}