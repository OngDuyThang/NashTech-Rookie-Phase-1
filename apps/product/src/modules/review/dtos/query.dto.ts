import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "@app/common";
import { ArgsType, Field } from "@nestjs/graphql";
import { SORT_REVIEW } from "../common";

@ArgsType()
export class SortQueryDto extends PaginationDto {
    @IsEnum(SORT_REVIEW)
    @IsOptional()
    @Field(() => String, { nullable: true, defaultValue: SORT_REVIEW.DATE_DESC })
    sort?: SORT_REVIEW
}