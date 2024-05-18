import { ProductService } from './product.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductEntity } from './entities/product.entity';
import { UUIDPipe } from '@app/common';

@Resolver(() => ProductEntity)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService
    ) {}

    // @Query(() => [ProductEntity])
    // async products(): Promise<ProductEntity[]> {
    //     return await this.productService.findAll();
    // }

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
