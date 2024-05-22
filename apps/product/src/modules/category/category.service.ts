import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./repositories/category.repository";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { CategoryEntity } from "./entities/category.entity";
import { ProductRepository } from "../product/repositories/product.repository";
import { SortQueryDto } from "../product/dtos/query.dto";
import { ProductEntity } from "../product/entities/product.entity";
import { SORT } from "../product/common";
import { IsNull, Not } from "typeorm";
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
        return await this.categoryRepository.create(createCategoryDto);
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
            relations: { products: true }
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

        switch (sort) {
            case SORT.ON_SALE:
                return await this.productsOnSale(category, page, limit);
            case SORT.PRICE_ASC:
                return await this.productsByPrice(category, page, limit, QUERY_ORDER.ASC);
            case SORT.PRICE_DESC:
                return await this.productsByPrice(category, page, limit, QUERY_ORDER.DESC);
        }
    }

    private async productsOnSale(
        category: CategoryEntity,
        page: number,
        limit: number
    ): Promise<[ProductEntity[], number]> {
        return await this.productRepository.findList({
            where: {
                category_id: category.id,
                promotion_id: Not(IsNull()),
                active: true
            },
            skip: page * limit,
            take: limit
        });
    }

    private async productsByPrice(
        category: CategoryEntity,
        page: number,
        limit: number,
        order: QUERY_ORDER
    ): Promise<[ProductEntity[], number]> {
        return await this.productRepository.findList({
            where: {
                category_id: category.id,
                active: true
            },
            skip: page * limit,
            take: limit,
            order: { price: order }
        });
    }
}