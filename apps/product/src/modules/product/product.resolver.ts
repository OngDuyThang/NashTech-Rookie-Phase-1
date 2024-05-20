import { ProductService } from './product.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductEntity } from './entities/product.entity';
import { PaginationPipe, RatingQueryDto, UUIDPipe } from '@app/common';
import { ProductList } from './entities/product-list.schema';

@Resolver(() => ProductEntity)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Query(() => ProductList)
    async products(
        @Args(PaginationPipe) queryDto: RatingQueryDto
    ): Promise<ProductList> {
        if (queryDto?.rating) {
            const [products, total] = await this.productService.findListByRating(queryDto);
            delete queryDto.rating

            return {
                data: products,
                ...queryDto,
                total
            }
        }

        const [products, total] = await this.productService.findList(queryDto);
        return {
            data: products,
            ...queryDto,
            total
        }
    }

    @Query(() => ProductEntity)
    async product(
        @Args('id', UUIDPipe) id: string
    ): Promise<ProductEntity> {
        return await this.productService.findOneById(id);
    }

    @Query(() => [ProductEntity])
    async searchProducts() {

    }
}