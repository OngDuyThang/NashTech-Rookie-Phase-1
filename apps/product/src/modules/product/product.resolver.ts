import { ProductService } from './product.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';

@Resolver(() => ProductEntity)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Query(() => [ProductEntity])
    async products(): Promise<ProductEntity[]> {
        return await this.productService.findAll();
    }

    // @Query(() => [ProductEntity])
    // async productsOnSale(): Promise<ProductEntity[]> {
    //     return await this.productService.findAllOnSale()
    // }

    @Query(() => ProductEntity)
    async product(
        @Args('id', new ParseUUIDPipe({ version: '4' }))
        id: string
    ): Promise<ProductEntity> {
        return await this.productService.findOneById(id);
    }

    @Query(() => [ProductEntity])
    async searchProducts() {

    }
}
