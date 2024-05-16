import { Injectable } from '@nestjs/common';
import { ProductRepository } from './repositories';
import { ProductEntity } from './entities';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { PromotionService } from './modules/promotion';

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly promotionService: PromotionService,
    ) {}

    async create(
        createProductDto: CreateProductDto
    ): Promise<ProductEntity> {
        return await this.productRepository.create(createProductDto);
    }

    async findOneById(
        id: string
    ): Promise<ProductEntity> {
        return await this.productRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<ProductEntity[]> {
        return await this.productRepository.find();
    }

    async findAllOnSale(): Promise<ProductEntity[]> {
        const promotions = await this.promotionService.findAll()
        const products: ProductEntity[] = []

        // Nestjs Bull
        for (let i = 0; i < promotions.length; i++) {
            const promotion = promotions[i]
            products.push(...promotion.products)
        }

        return products
    }

    async update(
        id: string,
        updateProductDto: UpdateProductDto
    ): Promise<void> {
        await this.productRepository.update({ id }, {
            ...updateProductDto
        });
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.productRepository.delete({ id });
    }
}
