import { ProductService } from './product.service';
import { ProductEntity } from './common/entities';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => ProductEntity)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Query(() => [ProductEntity])
    async findAll(): Promise<ProductEntity[]> {
        return await this.productService.findAll();
    }

    @Query(() => [ProductEntity])
    async findAllOnSale(): Promise<ProductEntity[]> {
        return await this.productService.findAllOnSale()
    }

    @Query(() => ProductEntity)
    async findOneById(
        @Args('id', new ParseUUIDPipe({ version: '4' }))
        id: string
    ): Promise<ProductEntity> {
        return await this.productService.findOneById(id);
    }

    @Query(() => [ProductEntity])
    async searchProducts() {

    }
}
