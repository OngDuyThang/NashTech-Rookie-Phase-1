import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { QUERY_ORDER, ProductSchema, SERVICE_NAME, SERVICE_MESSAGE, ERROR_MESSAGE, convertRpcException } from '@app/common';
import { ILike, In, SelectQueryBuilder } from 'typeorm';
import { ProductQueryDto } from './dtos/query.dto';
import { LAST_PRODUCT_CACHE_KEY, PRODUCT, PRODUCT_SORT, TCacheLastProduct } from './common';
import { ReviewService } from '../review/review.service';
import { Interval } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ReviewQueryDto } from '../review/dtos/query.dto';
import { REVIEW_SORT } from '../review/common';
import { ReviewEntity } from '../review/entities/review.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { TimeoutError, catchError, lastValueFrom, timeout } from 'rxjs';
import { CategoryRepository } from '../category/repositories/category.repository';
import { isEmpty, max, min } from 'lodash';

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly reviewService: ReviewService,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,

        @Inject(SERVICE_NAME.CART_SERVICE)
        private readonly cartService: ClientProxy,

        @Inject(SERVICE_NAME.ORDER_SERVICE)
        private readonly orderService: ClientProxy
    ) {}

    async create(
        createProductDto: CreateProductDto
    ): Promise<ProductEntity> {
        return await this.productRepository.create(createProductDto);
    }

    async findAll(): Promise<ProductEntity[]> {
        return await this.productRepository.find({
            where: { active: true },
            relations: {
                author: true,
                promotion: true,
                category: true
            }
        });
    }

    async findList(
        queryDto: ProductQueryDto
    ): Promise<[ProductEntity[], number]> {
        const { categoryIds, authorIds, ratings, page, limit, sort } = queryDto;
        const subcategoryIds = await this.categoryRepository.getAllSubcategoryIds(categoryIds)

        const query = this.productRepository.createQueryBuilder()
            .leftJoinAndSelect('product.author', 'author')
            .leftJoinAndSelect('product.promotion', 'promotion')
            .addSelect('product.updated_at')
            .where('product.active = true')
            .orderBy('product.updated_at', QUERY_ORDER.DESC)

        if (!isEmpty(subcategoryIds)) {
            query.andWhere('product.category_id IN (:...subcategoryIds)', { subcategoryIds })
        }

        if (!isEmpty(authorIds)) {
            query.andWhere('product.author_id IN (:...authorIds)', { authorIds })
        }

        if (!isEmpty(ratings)) {
            const minRating = min(ratings);
            const maxRating = max(ratings);
            query
                .andWhere('product.rating >= :minRating', { minRating })
                .andWhere('product.rating <= :maxRating', { maxRating })
        }

        try {
            switch (sort) {
                case PRODUCT_SORT.ON_SALE:
                    return await this.productsOnSale(query, page, limit);
                case PRODUCT_SORT.PRICE_ASC:
                    return await this.productsByPrice(query, page, limit, QUERY_ORDER.ASC);
                case PRODUCT_SORT.PRICE_DESC:
                    return await this.productsByPrice(query, page, limit, QUERY_ORDER.DESC);
                case PRODUCT_SORT.ALL:
                    return await query.
                        skip(page * limit)
                        .take(limit)
                        .getManyAndCount();;
            }
        } catch (e) {
            throw e
        }

    }

    private async productsOnSale(
        query: SelectQueryBuilder<ProductEntity>,
        page: number,
        limit: number
    ): Promise<[ProductEntity[], number]> {
        query.andWhere('product.promotion_id IS NOT NULL')

        try {
            return await query
                .skip(page * limit)
                .take(limit)
                .getManyAndCount();
        } catch (e) {
            throw e
        }
    }

    private async productsByPrice(
        query: SelectQueryBuilder<ProductEntity>,
        page: number,
        limit: number,
        order: QUERY_ORDER
    ): Promise<[ProductEntity[], number]> {
        query.orderBy('product.price', order)

        try {
            return await
                query
                    .skip(page * limit)
                    .take(limit)
                    .getManyAndCount();
        } catch (e) {
            throw e
        }
    }

    async findOneById(
        id: string
    ): Promise<ProductEntity> {
        try {
            return await this.productRepository.createQueryBuilder()
                .leftJoinAndSelect('product.author', 'author')
                .leftJoinAndSelect('product.promotion', 'promotion')
                .leftJoinAndSelect('product.reviews', 'reviews')
                .leftJoinAndSelect('product.category', 'category')
                .where('product.id = :id', { id })
                .andWhere('product.active = true')
                .getOne()
        } catch (e) {
            throw e
        }
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
        // await this.productRepository.update({ id }, { active: false });
        let queryRunner = this.productRepository.createQueryRunner()
        if (queryRunner.isReleased) {
            queryRunner = this.productRepository.createQueryRunner()
        }

        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            queryRunner.manager.update(ProductEntity, { id }, { active: false })

            const _ok = this.cartService.send({ cmd: SERVICE_MESSAGE.REMOVE_CART_ITEM }, id)
                .pipe(
                    timeout(10000),
                    catchError(e => {
                        if (e instanceof TimeoutError) {
                            throw new RequestTimeoutException(ERROR_MESSAGE.TIME_OUT)
                        }
                        throw convertRpcException(e)
                    })
                )
            const ok = await lastValueFrom(_ok) as boolean

            if (ok) {
                await queryRunner.commitTransaction()
            }
        } catch (e) {
            await queryRunner.rollbackTransaction()
            throw e
        } finally {
            await queryRunner.release()
        }
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.productRepository.delete({ id });
    }

    async findPromotionProducts(): Promise<ProductEntity[]> {
        try {
            return await this.productRepository.createQueryBuilder()
                .leftJoinAndSelect('product.author', 'author')
                .leftJoinAndSelect('product.promotion', 'promotion')
                .addSelect('product.updated_at')
                .where('product.active = :active', { active: true })
                .andWhere('product.promotion_id IS NOT NULL')
                .orderBy('product.updated_at', QUERY_ORDER.DESC)
                .take(PRODUCT.PROMOTION_CAROUSEL)
                .getMany()
        } catch (e) {
            throw e
        }
    }

    private async initProductCache(): Promise<TCacheLastProduct> {
        const firstProductRecord = await this.productRepository.createQueryBuilder()
            .addSelect('product.created_at')
            .orderBy('product.created_at', QUERY_ORDER.ASC)
            .getOne()

        const { id, created_at } = firstProductRecord
        return {
            id,
            created_at
        }
    }

    private async setLastProductCache(
        cache: TCacheLastProduct
    ): Promise<void> {
        await this.cacheManager.set(
            LAST_PRODUCT_CACHE_KEY,
            cache,
            PRODUCT.LAST_PRODUCT_CACHE_TIME
        );
    }

    private async getLastProductCache(): Promise<TCacheLastProduct> {
        try {
            const lastProduct = await this.cacheManager.get<TCacheLastProduct>(LAST_PRODUCT_CACHE_KEY)
            if (!lastProduct) {
                const cache = await this.initProductCache()
                await this.setLastProductCache(cache)

                return cache
            }

            return lastProduct
        } catch (e) {
            throw e
        }
    }

    private async getProductsForCron(
        id: string,
        created_at: Date,
    ): Promise<ProductEntity[]> {
        return await this.productRepository.createQueryBuilder()
            .where(
                'product.created_at > :createdAt OR (product.created_at = :createdAt AND product.id > :id)',
                { createdAt: created_at, id }
            )
            .orderBy('product.created_at', QUERY_ORDER.ASC)
            .addSelect('product.created_at')
            .take(PRODUCT.CRON_TAKE)
            .getMany()
    }

    @Interval(PRODUCT.CRON_INTERVAL)
    async cronProductRating() {
        try {
            const lastProduct = await this.getLastProductCache()
            const { id, created_at } = lastProduct
            const products = await this.getProductsForCron(id, created_at)

            if (products.length > 1) {
                await this.setLastProductCache({
                    id: products[products.length - 1].id,
                    created_at: products[products.length - 1].created_at
                })
            } else {
                const cache = await this.initProductCache()
                await this.setLastProductCache(cache)
                return
            }

            for (let i = 0; i < products.length; i++) {
                const product = products[i]
                const ratings = await this.reviewService.getProductRatings(product.id)
                const rating = this.reviewService.getAverageRating(ratings)

                await this.productRepository.update(
                    { id: product.id },
                    { rating, ratings }
                )
            }
        } catch (e) {
            throw e
        }
    }

    async findRecommendProducts(): Promise<ProductEntity[]> {
        try {
            return await this.productRepository.createQueryBuilder()
                .leftJoinAndSelect('product.author', 'author')
                .leftJoinAndSelect('product.promotion', 'promotion')
                .where('product.active = :active', { active: true })
                .orderBy('product.rating', QUERY_ORDER.DESC)
                .take(PRODUCT.RECOMMEND_HOW_MANY)
                .getMany()
        } catch (e) {
            throw e
        }
    }

    async findPopularProducts(): Promise<ProductEntity[]> {
        const _popularProductIds = this.orderService.send({ cmd: SERVICE_MESSAGE.GET_POPULAR_PRODUCTS }, {})
            .pipe(
                timeout(10000),
                catchError(e => {
                    if (e instanceof TimeoutError) {
                        throw new RequestTimeoutException(ERROR_MESSAGE.TIME_OUT)
                    }
                    throw convertRpcException(e)
                })
            )
        const popularProductIds = await lastValueFrom(_popularProductIds) as string[]

        return await this.productRepository.find({
            where: {
                id: In(popularProductIds),
                active: true
            },
            relations: {
                author: true,
                promotion: true
            }
        })
    }

    // async findProductsByRating(
    //     queryDto: RatingQueryDto
    // ): Promise<[ProductEntity[], number]> {
    //     const { page, limit, rating, sort } = queryDto

    //     try {
    //         switch (sort) {
    //             case PRODUCT_SORT.ON_SALE:
    //                 return await this.productsOnSale(page, limit, rating)
    //             case PRODUCT_SORT.PRICE_ASC:
    //                 return await this.productsByPrice(page, limit, rating, QUERY_ORDER.ASC)
    //             case PRODUCT_SORT.PRICE_DESC:
    //                 return await this.productsByPrice(page, limit, rating, QUERY_ORDER.DESC)
    //         }
    //     } catch (e) {
    //         throw e
    //     }
    // }

    // private productsByRatingQuery(
    //     page: number,
    //     limit: number,
    //     rating: number
    // ): SelectQueryBuilder<ProductEntity> {
    //     return this.productOrgRepo.createQueryBuilder('product')
    //         .innerJoin(
    //             queryBuilder => queryBuilder
    //                 .from(ReviewEntity, 'review')
    //                 .select('review.product_id', 'product_id')
    //                 .addSelect('AVG(review.rating)', 'avg_rating')
    //                 .groupBy('review.product_id')
    //                 .having('AVG(review.rating) = :averageRating', { averageRating: rating }),
    //             'avg_reviews',
    //             'product.id = avg_reviews.product_id'
    //         )
    //         .skip(page)
    //         .take(limit)
    // }

    async findReviewsByProduct(
        product: ProductEntity,
        queryDto: ReviewQueryDto
    ): Promise<[ReviewEntity[], number]> {
        const { page, limit, sort, star } = queryDto;

        switch (sort) {
            case REVIEW_SORT.DATE_ASC:
                return await this.reviewService.getReviewsOfProduct(
                    product,
                    page,
                    limit,
                    QUERY_ORDER.ASC,
                    star
                );
            case REVIEW_SORT.DATE_DESC:
                return await this.reviewService.getReviewsOfProduct(
                    product,
                    page,
                    limit,
                    QUERY_ORDER.DESC,
                    star
                );
        }
    }

    async findProductOnCart(
        id: string
    ): Promise<ProductSchema> {
        try {
            const product = await this.productRepository.findOne({
                where: {
                    id,
                    active: true
                },
                relations: {
                    promotion: true,
                    author: true
                }
            })

            return {
                id,
                title: product?.title || '',
                price: product?.price || 0,
                discount: product?.promotion?.discount_percent || 0,
                image: product?.image || '',
                author: product?.author?.pen_name || ''
            }
        } catch (e) {
            throw new RpcException(e)
        }
    }

    async getRecentlyUpdatedProducts() {
        try {
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            const products = await this.productRepository.createQueryBuilder()
                .where('product.updatedAt > :oneHourAgo', { oneHourAgo })
                .orderBy('product.updatedAt', 'DESC')
                .getMany();

            return products;
        } catch (e) {
            throw e
        }
    }

    async searchProducts(
        query: string
    ): Promise<ProductEntity[]> {
        try {
            return this.productRepository.find({
                where: [
                    { title: ILike(`%${query}%`), active: true },
                    { author: { pen_name: ILike(`%${query}%`) }, active: true }
                ],
                relations: {
                    author: true
                }
            })
        } catch (e) {
            throw e
        }
    }
}
