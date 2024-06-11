import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { PaginationDto } from '@app/common';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { REVIEW_SORT, STAR } from '../common';
import { Type } from 'class-transformer';

@ArgsType()
export class ReviewQueryDto extends PaginationDto {
  @IsEnum(REVIEW_SORT)
  @IsOptional()
  @Field(() => String, { nullable: true, defaultValue: REVIEW_SORT.DATE_DESC })
  sort?: REVIEW_SORT;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(STAR.MIN)
  @Max(STAR.MAX)
  @Field(() => Int, { nullable: true, defaultValue: STAR.MAX })
  star?: number;
}
