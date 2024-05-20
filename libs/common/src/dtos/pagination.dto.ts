import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString, IsOptional } from "class-validator";

// Pagination DTO for both query and arguments
@ArgsType()
export abstract class PaginationDto {
    @IsNumberString()
    @IsNotEmpty()
    @Field(() => String, { nullable: true, defaultValue: '0' })
    page: number;

    @IsNumberString()
    @IsNotEmpty()
    @Field(() => String, { nullable: true, defaultValue: '10' })
    limit: number
}