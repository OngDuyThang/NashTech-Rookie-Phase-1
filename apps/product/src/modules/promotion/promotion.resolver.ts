import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { PromotionEntity } from './entities/promotion.entity';
import { PromotionService } from './promotion.service';
import { ProductRepository } from '../product/repositories/product.repository';
import { PaginationDto, PaginationPipe, UUIDPipe } from '@app/common';
import { ProductList } from '../product/entities/product-list.schema';

@Resolver(() => PromotionEntity)
export class PromotionResolver {
    constructor(
        private readonly promotionService: PromotionService,
        private readonly productRepository: ProductRepository
    ) {}

    @Query(() => [PromotionEntity])
    async promotions(): Promise<PromotionEntity[]> {
        return await this.promotionService.findAll();
    }

    @Query(() => PromotionEntity)
    async promotion(
        @Args('id', UUIDPipe) id: string
    ): Promise<PromotionEntity> {
        return await this.promotionService.findOneById(id);
    }

    @ResolveField(() => ProductList)
    async products(
        @Parent() promotion: PromotionEntity,
        @Args(PaginationPipe) queryDto: PaginationDto
    ): Promise<ProductList> {
        const { page, limit } = queryDto

        const [products, total] = await this.productRepository.findList({
            where: { promotion_id: promotion.id },
            skip: page * limit,
            take: limit
        });

        return {
            data: products,
            ...queryDto,
            total
        }
    }
}