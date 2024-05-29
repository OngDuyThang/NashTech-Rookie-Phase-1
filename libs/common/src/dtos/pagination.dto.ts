import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { PAGINATION } from "../enums/pagination";

// Pagination DTO for both query and arguments
@ArgsType()
export abstract class PaginationDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Field(() => Int, { nullable: true, defaultValue: PAGINATION.DEFAULT_PAGE })
    page: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    @Min(Number(PAGINATION.MIN_LIMIT))
    @Max(Number(PAGINATION.MAX_LIMIT))
    @Field(() => Int, { nullable: true, defaultValue: PAGINATION.DEFAULT_LIMIT })
    limit: number
}