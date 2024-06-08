import { Test, TestingModule } from "@nestjs/testing";
import { ProductResolver } from "./product.resolver";
import { ProductService } from "./product.service";
import { ProductEntity } from "./entities/product.entity";
import { isEmpty } from "lodash";
import { ProductQueryDto } from "./dtos/query.dto";
import { PRODUCT_SORT } from "./common";
import { v4 as uuidv4 } from 'uuid';
import { ReviewQueryDto } from "../review/dtos/query.dto";
import { REVIEW_SORT, STAR } from "../review/common";
import { ReviewEntity } from "../review/entities/review.entity";

describe('ProductResolver', () => {
    let productResolver: ProductResolver;
    let productService: ProductService;

    const productQueryDto: ProductQueryDto = {
        categoryIds: [],
        authorIds: [],
        ratings: [],
        page: 0,
        limit: 10,
        sort: PRODUCT_SORT.ON_SALE
    }
    const reviewQueryDto: ReviewQueryDto = {
        page: 0,
        limit: 10,
        sort: REVIEW_SORT.DATE_ASC,
        star: STAR.MAX
    }
    const productId: string = uuidv4()

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductResolver,
                {
                    provide: ProductService,
                    useFactory: (): Partial<ProductService> => ({
                        findPromotionProducts: jest.fn().mockImplementation(
                            () => Promise.resolve([new ProductEntity()])
                        ),
                        findRecommendProducts: jest.fn().mockImplementation(
                            () => Promise.resolve([new ProductEntity()])
                        ),
                        findPopularProducts: jest.fn().mockImplementation(
                            () => Promise.resolve([new ProductEntity()])
                        ),
                        findList: jest.fn().mockImplementation(
                            () => Promise.resolve([[new ProductEntity()], 1])
                        ),
                        findOneById: jest.fn().mockImplementation(
                            () => Promise.resolve(new ProductEntity())
                        ),
                        findReviewsByProduct: jest.fn().mockImplementation(
                            () => Promise.resolve([[new ReviewEntity()], 1])
                        )
                    })
                }
            ]
        }).compile();

        productResolver = module.get<ProductResolver>(ProductResolver);
        productService = module.get<ProductService>(ProductService)
    })

    describe('resolvers which return an array of product entity', () => {
        it('popularProducts returns an array of products', async () => {
            const result = await productResolver.popularProducts();
            expect(result).toBeInstanceOf(Array);

            if (!isEmpty(result)) {
                expect(result[0]).toBeInstanceOf(ProductEntity)
            }
        })
        it('findPopularProducts returns an array of products', async () => {
            const result = await productResolver.promotionProducts();
            expect(result).toBeInstanceOf(Array);

            if (!isEmpty(result)) {
                expect(result[0]).toBeInstanceOf(ProductEntity)
            }
        })
        it('recommendProducts returns an array of products', async () => {
            const result = await productResolver.recommendProducts();
            expect(result).toBeInstanceOf(Array);

            if (!isEmpty(result)) {
                expect(result[0]).toBeInstanceOf(ProductEntity)
            }
        })
    })

    describe('product list for pagination and filter', () => {
        it('products returns a list of products', async () => {
            const result = await productResolver.products(productQueryDto);
            expect(result.limit).toBeTruthy();
            expect(result.page).toBeGreaterThanOrEqual(0)
            expect(result.total).toBeGreaterThanOrEqual(0)

            const products = result.data
            expect(products).toBeInstanceOf(Array)

            if (!isEmpty(products)) {
                expect(products[0]).toBeInstanceOf(ProductEntity)
            }
        })
    })

    describe('one product for detail', () => {
        it('product returns an instance of product entity', async () => {
            const result = await productResolver.product(productId);
            expect(result).toBeInstanceOf(ProductEntity);
        })
    })

    describe('get review list of a product', () => {
        it('reviews returns a list of reviews', async () => {
            const result = await productResolver.reviews(new ProductEntity(), reviewQueryDto);
            expect(result.limit).toBeTruthy();
            expect(result.page).toBeGreaterThanOrEqual(0)
            expect(result.total).toBeGreaterThanOrEqual(0)

            const reviews = result.data
            expect(reviews).toBeInstanceOf(Array)

            if (!isEmpty(reviews)) {
                expect(reviews[0]).toBeInstanceOf(ReviewEntity)
            }
        })
    })
})
