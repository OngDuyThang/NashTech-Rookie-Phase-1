import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./repositories/category.repository";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { CategoryEntity } from "./entities/category.entity";
import { ProductRepository } from "../product/repositories/product.repository";
import { SortQueryDto } from "../product/dtos/query.dto";
import { ProductEntity } from "../product/entities/product.entity";
import { PRODUCT_SORT } from "../product/common";
import { In, IsNull, Not } from "typeorm";
import { QUERY_ORDER } from "@app/common";

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly productRepository: ProductRepository
    ) {}

    async create(
        createCategoryDto: CreateCategoryDto
    ): Promise<CategoryEntity> {
        console.log(createCategoryDto)
        return await this.categoryRepository.create({ ...createCategoryDto });
    }

    async findAll(): Promise<CategoryEntity[]> {
        return await this.categoryRepository.find({
            where: { active: true },
            relations: { parent: true }
        })
    }

    async findOneById(
        id: string
    ): Promise<CategoryEntity> {
        return await this.categoryRepository.findOne({
            where: { id, active: true },
            relations: {
                products: true,
                parent: true
            }
        })
    }

    async update(
        id: string,
        updateCategoryDto: CreateCategoryDto
    ): Promise<void> {
        return await this.categoryRepository.update({ id }, {
            ...updateCategoryDto
        });
    }

    async remove(
        id: string
    ): Promise<void> {
        return await this.categoryRepository.update({ id }, { active: false })
    }

    async delete(
        id: string
    ): Promise<void> {
        return await this.categoryRepository.delete({ id })
    }

    async findProductsByCategory(
        category: CategoryEntity,
        queryDto: SortQueryDto
    ): Promise<[ProductEntity[], number]> {
        const { page, limit, sort } = queryDto;

        const subcategoryIds = await this.categoryRepository.getAllSubcategoryIds(category.id)

        switch (sort) {
            case PRODUCT_SORT.ON_SALE:
                return await this.productsOnSale(category, subcategoryIds, page, limit);
            case PRODUCT_SORT.PRICE_ASC:
                return await this.productsByPrice(category, subcategoryIds, page, limit, QUERY_ORDER.ASC);
            case PRODUCT_SORT.PRICE_DESC:
                return await this.productsByPrice(category, subcategoryIds, page, limit, QUERY_ORDER.DESC);
        }
    }

    private async productsOnSale(
        category: CategoryEntity,
        subcategoryIds: string[],
        page: number,
        limit: number
    ): Promise<[ProductEntity[], number]> {
        return await this.productRepository.findList({
            where: {
                category_id: In([...subcategoryIds, category.id]),
                promotion_id: Not(IsNull()),
                active: true
            },
            relations: {
                author: true,
                promotion: true
            },
            skip: page * limit,
            take: limit
        });
    }

    private async productsByPrice(
        category: CategoryEntity,
        subcategoryIds: string[],
        page: number,
        limit: number,
        order: QUERY_ORDER
    ): Promise<[ProductEntity[], number]> {
        return await this.productRepository.findList({
            where: {
                category_id: In([...subcategoryIds, category.id]),
                active: true
            },
            skip: page * limit,
            take: limit,
            order: { price: order }
        });
    }
}