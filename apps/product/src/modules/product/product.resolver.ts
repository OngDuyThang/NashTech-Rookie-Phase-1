import { ProductService } from './product.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductEntity } from './entities/product.entity';
import { PaginationDto, PaginationPipe, UUIDPipe } from '@app/common';
import { ProductList } from './entities/product-list.schema';

@Resolver(() => ProductEntity)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Query(() => ProductList)
    async products(
        @Args(PaginationPipe) paginationDto: PaginationDto
    ): Promise<ProductList> {
        const [products, total] = await this.productService.findList(paginationDto);
        return {
            data: products,
            ...paginationDto,
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