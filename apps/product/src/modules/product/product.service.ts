import { Injectable } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { PaginationDto } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from '../review/entities/review.entity';

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        @InjectRepository(ProductEntity)
        private readonly productOrgRepo: Repository<ProductEntity>
    ) {}

    async create(
        createProductDto: CreateProductDto
    ): Promise<ProductEntity> {
        return await this.productRepository.create(createProductDto);
    }

    async findAll(): Promise<ProductEntity[]> {
        return await this.productRepository.find({ where: { active: true } });
    }

    async findList(
        paginationDto: PaginationDto
    ): Promise<[ProductEntity[], number]> {
        const { page, limit } = paginationDto

        return await this.productRepository.findList({
            where: { active: true },
            skip: page * limit,
            take: limit
        });
    }

    async findOneById(
        id: string
    ): Promise<ProductEntity> {
        return await this.productRepository.findOne({
            where: {
                id,
                active: true
            },
            relations: {
                reviews: true
            }
        });
    }

    async update(
        id: string,
        updateProductDto: CreateProductDto
    ): Promise<void> {
        await this.productRepository.update({ id }, {
            ...updateProductDto
        });
    }

    async remove(
        id: string
    ): Promise<void> {
        await this.productRepository.update({ id }, { active: false });
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.productRepository.delete({ id });
    }

    async findListByRating(
        paginationDto: PaginationDto
    ): Promise<[ProductEntity[], number]> {
        const { page, limit, rating } = paginationDto
        try {
            return await this.productOrgRepo.createQueryBuilder('product')
                .innerJoin(
                    queryBuilder => queryBuilder
                        .from(ReviewEntity, 'review')
                        .select('review.product_id', 'product_id')
                        .addSelect('AVG(review.rating)', 'avg_rating')
                        .groupBy('review.product_id')
                        .having('AVG(review.rating) = :averageRating', { averageRating: rating }),
                    'avg_reviews',
                    'product.id = avg_reviews.product_id'
                )
                .skip(page)
                .take(limit)
                .getManyAndCount();
        } catch (e) {
            throw e
        }
    }
}
