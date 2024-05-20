import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { PromotionEntity } from './entities/promotion.entity';
import { PromotionService } from './promotion.service';
import { ProductEntity } from '../product/entities/product.entity';
import { ProductRepository } from '../product/repositories/product.repository';
import { UUIDPipe } from '@app/common';

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

    // Promotion products
    @ResolveField(() => [ProductEntity])
    async products(
        @Parent() promotion: PromotionEntity
    ): Promise<ProductEntity[]> {
        return await this.productRepository.find({ where: { promotion_id: promotion.id } });
    }
}