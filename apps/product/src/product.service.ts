import { Injectable } from '@nestjs/common';
import { ProductRepository } from './repositories';
import { ProductEntity } from './entities';
import { CreateProductDto, UpdateProductDto } from './dtos';

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository
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
