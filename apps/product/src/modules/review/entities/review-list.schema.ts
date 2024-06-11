import { TGqlListDataShape } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { ReviewEntity } from './review.entity';

@ObjectType()
export class ReviewList extends TGqlListDataShape {
  @Field(() => [ReviewEntity])
  data: ReviewEntity[];
}
