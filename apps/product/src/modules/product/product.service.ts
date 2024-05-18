import { Injectable } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PaginationDto } from '@app/common';

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
    ) {}

    async create(
        createProductDto: CreateProductDto
    ): Promise<ProductEntity> {
        return await this.productRepository.create(createProductDto);
    }

    async findAll(): Promise<ProductEntity[]> {
        return await this.productRepository.find();
    }

    async findList(
        paginationDto: PaginationDto
    ): Promise<[ProductEntity[], number]> {
        const { page, limit } = paginationDto

        return await this.productRepository.findList({
            skip: page * limit,
            take: limit
        });
    }

    async findOneById(
        id: string
    ): Promise<ProductEntity> {
        return await this.productRepository.findOne({ where: { id } });
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
