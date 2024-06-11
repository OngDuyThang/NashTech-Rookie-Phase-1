import { Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  @Field()
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

  // UserEntity
  @IsUUID(4)
  @IsNotEmpty()
  @Field()
  user_id: string;
}
