import { Injectable } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { PaginationDto, QUERY_ORDER } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { ReviewEntity } from '../review/entities/review.entity';
import { RatingQueryDto } from './dtos/query.dto';
import { PRODUCT, SORT } from './common';

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
        queryDto: PaginationDto
    ): Promise<[ProductEntity[], number]> {
        const { page, limit } = queryDto

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

    async findPromotionProducts(): Promise<ProductEntity[]> {
        return await this.productRepository.find({
            where: {
                active: true,
                promotion_id: Not(IsNull())
            },
            order: { updated_at: QUERY_ORDER.DESC },
            take: PRODUCT.PROMOTION_CAROUSEL
        });
    }

    async findRecommendProducts(): Promise<ProductEntity[]> {
        try {
            return await this.productOrgRepo.createQueryBuilder('product')
                .innerJoin(
                    queryBuilder => queryBuilder
                        .from(ReviewEntity, 'review')
                        .select('review.product_id', 'product_id')
                        .addSelect('AVG(review.rating)', 'avg_rating')
                        .groupBy('review.product_id')
                        .having(
                            'AVG(review.rating) >= :recommendPoint',
                            { recommendPoint: PRODUCT.RECOMMEND_POINT }
                        )
                        .orderBy('avg_rating', QUERY_ORDER.DESC),
                    'avg_reviews',
                    'product.id = avg_reviews.product_id'
                )
                .take(PRODUCT.RECOMMEND_HOW_MANY)
                .getMany()
        } catch (e) {
            throw e
        }
    }

    async findProductsByRating(
        queryDto: RatingQueryDto
    ): Promise<[ProductEntity[], number]> {
        const { page, limit, rating, sort } = queryDto

        try {
            switch (sort) {
                case SORT.ON_SALE:
                    return await this.productsOnSale(page, limit, rating)
                case SORT.PRICE_ASC:
                    return await this.productsByPrice(page, limit, rating, QUERY_ORDER.ASC)
                case SORT.PRICE_DESC:
                    return await this.productsByPrice(page, limit, rating, QUERY_ORDER.DESC)
            }
        } catch (e) {
            throw e
        }
    }

    private productsByRatingQuery(
        page: number,
        limit: number,
        rating: number
    ): SelectQueryBuilder<ProductEntity> {
        return this.productOrgRepo.createQueryBuilder('product')
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
    }

    private async productsOnSale(
        page: number,
        limit: number,
        rating: number
    ): Promise<[ProductEntity[], number]> {
        return await this.productsByRatingQuery(page, limit, rating)
            .where('product.promotion_id IS NOT NULL')
            .getManyAndCount()
    }

    private async productsByPrice(
        page: number,
        limit: number,
        rating: number,
        order: QUERY_ORDER
    ): Promise<[ProductEntity[], number]> {
        return await this.productsByRatingQuery(page, limit, rating)
            .orderBy('product.price', order)
            .getManyAndCount()
    }
}
