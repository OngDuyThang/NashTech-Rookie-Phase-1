import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GetUser, PermissionRequestGuard, ROLE, Roles, RolesGuard, UUIDPipe, UserEntity } from '@app/common';
import { ReviewEntity } from './entities/review.entity';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UseGuards } from '@nestjs/common';

@Resolver(() => ReviewEntity)
export class ReviewResolver {
    constructor(
        private readonly reviewService: ReviewService
    ) {}

    @Mutation(() => ReviewEntity)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async createReview(
        @Args('review') review: CreateReviewDto,
        @GetUser() user: UserEntity
    ): Promise<ReviewEntity> {
        return await this.reviewService.create(user.id, review);
    }

    @Query(() => [ReviewEntity])
    async reviews(): Promise<ReviewEntity[]> {
        return await this.reviewService.findAll();
    }

    @Query(() => ReviewEntity)
    async review(
        @Args('id', UUIDPipe) id: string
    ): Promise<ReviewEntity> {
        return await this.reviewService.findOneById(id);
    }
}