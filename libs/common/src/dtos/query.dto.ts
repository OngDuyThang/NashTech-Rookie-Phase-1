import { IsNumberString, IsOptional } from "class-validator";
import { PaginationDto } from "./pagination.dto";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class RatingQueryDto extends PaginationDto {
    @IsNumberString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    rating?: number;
}