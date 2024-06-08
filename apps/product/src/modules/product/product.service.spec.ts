import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "./product.service";
import { ProductRepository } from "./repositories/product.repository";
import { ProductEntity } from "./entities/product.entity";
import { CreateProductDto } from "./dtos/create-product.dto";
import { CategoryRepository } from "../category/repositories/category.repository";
import { v4 as uuidv4 } from 'uuid';
import { Provider } from "@nestjs/common";
import { ReviewService } from "../review/review.service";
import { ReviewQueryDto } from "../review/dtos/query.dto";
import { REVIEW_SORT, STAR } from "../review/common";
import { ReviewEntity } from "../review/entities/review.entity";
import { ClientProxy } from "@nestjs/microservices";
import { SERVICE_NAME } from "@app/common";
import { CACHE_MANAGER, Cache, } from "@nestjs/cache-manager";
import { isEmpty } from "lodash";
import { ProductQueryDto } from "./dtos/query.dto";
import { PRODUCT_SORT } from "./common";

describe('ProductService', () => {
    let productService: ProductService;
    let productRepository: ProductRepository

    const createProductDto: CreateProductDto = {
        title: '',
        price: 1
    }
    const productQueryDto: ProductQueryDto = {
        categoryIds: [],
        authorIds: [],
        ratings: [],
        page: 0,
        limit: 10,
        sort: PRODUCT_SORT.ON_SALE
    }
    const uuid = uuidv4()
    const reviewQueryDto: ReviewQueryDto = {
        page: 0,
        limit: 10,
        sort: REVIEW_SORT.DATE_ASC,
        star: STAR.MAX
    }
    const providers: Provider[] = [
        {
            provide: ProductRepository,
            useFactory: (): Partial<ProductRepository> => ({
                create: jest.fn().mockImplementation(
                    () => Promise.resolve(new ProductEntity())
                ),
                find: jest.fn().mockImplementation(
                    () => Promise.resolve([new ProductEntity()])
                ),
                findOne: jest.fn().mockImplementation(
                    () => Promise.resolve(new ProductEntity())
                ),
                createQueryBuilder: jest.fn().mockImplementation(() => ({
                    leftJoinAndSelect: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    andWhere: jest.fn().mockReturnThis(),
                    addSelect: jest.fn().mockReturnThis(),
                    orderBy: jest.fn().mockReturnThis(),
                    take: jest.fn().mockReturnThis(),
                    skip: jest.fn().mockReturnThis(),
                    getManyAndCount: jest.fn().mockImplementation(() => Promise.resolve([[new ProductEntity()], 1])),
                    getMany: jest.fn().mockImplementation(() => Promise.resolve([new ProductEntity()])),
                    getOne: jest.fn().mockImplementation(() => Promise.resolve(new ProductEntity())),
                } as any))
            })
        },
        {
            provide: CategoryRepository,
            useFactory: (): Partial<CategoryRepository> => ({
                getAllSubcategoryIds: jest.fn().mockImplementation(
                    () => Promise.resolve([uuid])
                ),
            })
        },
        {
            provide: ReviewService,
            useFactory: (): Partial<ReviewService> => ({
                getProductRatings: jest.fn().mockImplementation(
                    () => Promise.resolve([1])
                ),
                getAverageRating: jest.fn().mockImplementation(
                    () => Promise.resolve(1)
                ),
                getReviewsOfProduct: jest.fn().mockImplementation(
                    () => Promise.resolve([new ReviewEntity(), 1])
                )
            })
        },
        {
            provide: CACHE_MANAGER,
            useValue: Cache
        },
        {
            provide: SERVICE_NAME.CART_SERVICE,
            useValue: ClientProxy
        },
        {
            provide: SERVICE_NAME.ORDER_SERVICE,
            useFactory: () => ({
                send: jest.fn().mockReturnThis(),
                pipe: jest.fn().mockReturnThis(),
            })
        }
    ]

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                ...providers
            ],
        }).compile();
        productService = module.get<ProductService>(ProductService);
        productRepository = module.get<ProductRepository>(ProductRepository)
    })

    describe('create', () => {
        it('create should return an entity', async () => {
            const product = await productService.create(createProductDto)
            expect(product).toBeInstanceOf(ProductEntity)
        })
    })

    describe('findAll', () => {
        it('should return array product entities', async () => {
            const products = await productService.findAll()
            expect(products).toBeInstanceOf(Array)

            if (!isEmpty(products)) {
                expect(products[0]).toBeInstanceOf(ProductEntity)
            }
        })
    })

    describe('findOne', () => {
        it('should return an entity', async () => {
            const product = await productService.findOneById(uuid)
            expect(product).toBeInstanceOf(ProductEntity)
        })
    })

    describe('findList', () => {
        it('should return product list', async () => {
            const [products, total] = await productService.findList(productQueryDto)
            expect(products).toBeInstanceOf(Array)
            expect(total).toBeGreaterThanOrEqual(0)

            if (!isEmpty(products)) {
                expect(products[0]).toBeInstanceOf(ProductEntity)
            }
        })
    })

    describe('findRecommendProducts', () => {
        it('should return product array', async () => {
            const products = await productService.findRecommendProducts()
            expect(products).toBeInstanceOf(Array)

            if (!isEmpty(products)) {
                expect(products[0]).toBeInstanceOf(ProductEntity)
            }
        })
    })
})