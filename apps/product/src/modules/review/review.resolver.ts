import { Resolver, Query, Args, Parent, ResolveField, Mutation } from '@nestjs/graphql';
import { ProductRepository } from '../product/repositories/product.repository';
import { PaginationDto, PaginationPipe, PermissionRequestGuard, ROLE, Roles, RolesGuard, UUIDPipe } from '@app/common';
import { ProductList } from '../product/entities/product-list.schema';
import { ReviewEntity } from './entities/review.entity';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UseGuards } from '@nestjs/common';

@Resolver(() => ReviewEntity)
export class ReviewResolver {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly productRepository: ProductRepository
    ) {}

    @Mutation(() => ReviewEntity)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async createReview(
        @Args('review') review: CreateReviewDto
    ): Promise<ReviewEntity> {
        return await this.reviewService.create(review);
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

    // Find products by rating
    //   @ResolveField(() => ProductList)
    //   async products(
    //     @Parent() review: ReviewEntity,
    //     @Args(PaginationPipe) paginationDto: PaginationDto
    //   ): Promise<ProductList> {
    //     const {  } = review;
    //     const { page, limit } = paginationDto

    //     const [products, total] = await this.productRepository.findList({
    //       where: { : category.id },
    //       skip: page * limit,
    //       take: limit
    //     });

    //     return {
    //       data: products,
    //       page,
    //       limit,
    //       total
    //     }
    //   }
}