import { ProductService } from './product.service';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductEntity } from './entities/product.entity';
import { PaginationDto, PaginationPipe, UUIDPipe } from '@app/common';
import { ProductList } from './entities/product-list.schema';
import { RatingQueryDto } from './dtos/query.dto';
import { ReviewList } from '../review/entities/review-list.schema';
import { SortQueryDto as ReviewSortQueryDto } from '../review/dtos/query.dto';

@Resolver(() => ProductEntity)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Query(() => ProductList)
    async products(
        @Args(PaginationPipe) queryDto: PaginationDto
    ): Promise<ProductList> {
        const [products, total] = await this.productService.findList(queryDto);
        return {
            data: products,
            ...queryDto,
            total
        }
    }

    // Promotion products for carousel
    @Query(() => [ProductEntity])
    async promotionProducts(): Promise<ProductEntity[]> {
        return await this.productService.findPromotionProducts();
    }

    @Query(() => [ProductEntity])
    async recommendProducts(): Promise<ProductEntity[]> {
        return await this.productService.findRecommendProducts();
    }

    @Query(() => ProductList)
    async productsByRating(
        @Args(PaginationPipe) queryDto: RatingQueryDto
    ): Promise<ProductList> {
        const [products, total] = await this.productService.findProductsByRating(queryDto);
        const { page, limit } = queryDto

        return {
            data: products,
            page,
            limit,
            total
        }
    }

    @Query(() => ProductEntity)
    async product(
        @Args('id', UUIDPipe) id: string
    ): Promise<ProductEntity> {
        return await this.productService.findOneById(id);
    }

    @ResolveField(() => ReviewList)
    async reviews(
        @Parent() product: ProductEntity,
        @Args(PaginationPipe) queryDto: ReviewSortQueryDto
    ): Promise<ReviewList> {
        const [reviews, total] = await this.productService.findReviewsByProduct(product, queryDto);

        const { page, limit } = queryDto
        return {
            data: reviews,
            page,
            limit,
            total
        }
    }

    @Query(() => [ProductEntity])
    async searchProducts() {

    }
}