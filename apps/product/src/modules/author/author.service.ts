import { Injectable } from "@nestjs/common";
import { AuthorRepository } from "./repositories/author.repository";
import { CreateAuthorDto } from "./dtos/create-author.dto";
import { AuthorEntity } from "./entities/author.entity";
import { SortQueryDto } from "../product/dtos/query.dto";
import { ProductEntity } from "../product/entities/product.entity";
import { ProductRepository } from "../product/repositories/product.repository";
import { PRODUCT_SORT } from "../product/common";
import { QUERY_ORDER } from "@app/common";
import { IsNull, Not } from "typeorm";

@Injectable()
export class AuthorService {
    constructor(
        private readonly authorRepository: AuthorRepository,
        private readonly productRepository: ProductRepository
    ) {}

    async create(
        createAuthorDto: CreateAuthorDto
    ): Promise<AuthorEntity> {
        return await this.authorRepository.create(createAuthorDto);
    }

    async findAll(): Promise<AuthorEntity[]> {
        return await this.authorRepository.find();
    }

    async findOneById(
        id: string
    ): Promise<AuthorEntity> {
        return await this.authorRepository.findOne({
            where: { id },
            relations: { products: true }
        });
    }

    async update(
        id: string,
        updateAuthorDto: CreateAuthorDto
    ): Promise<void> {
        await this.authorRepository.update({ id }, {
            ...updateAuthorDto
        });
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.authorRepository.delete({ id });
    }

    async findProductsByAuthor(
        author: AuthorEntity,
        queryDto: SortQueryDto
    ): Promise<[ProductEntity[], number]> {
        const { page, limit, sort } = queryDto;

        switch (sort) {
            case PRODUCT_SORT.ON_SALE:
                return await this.productsOnSale(author, page, limit);
            case PRODUCT_SORT.PRICE_ASC:
                return await this.productsByPrice(author, page, limit, QUERY_ORDER.ASC);
            case PRODUCT_SORT.PRICE_DESC:
                return await this.productsByPrice(author, page, limit, QUERY_ORDER.DESC);
        }
    }

    private async productsOnSale(
        author: AuthorEntity,
        page: number,
        limit: number
    ): Promise<[ProductEntity[], number]> {
        return await this.productRepository.findList({
            where: {
                author_id: author.id,
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
        author: AuthorEntity,
        page: number,
        limit: number,
        order: QUERY_ORDER
    ): Promise<[ProductEntity[], number]> {
        return await this.productRepository.findList({
            where: {
                author_id: author.id,
                active: true
            },
            relations: {
                author: true,
                promotion: true
            },
            skip: page * limit,
            take: limit,
            order: { price: order }
        });
    }
}