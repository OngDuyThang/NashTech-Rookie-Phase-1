import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./repositories/category.repository";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { CategoryEntity } from "./entities/category.entity";

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository
    ) {}

    async create(
        createCategoryDto: CreateCategoryDto
    ): Promise<CategoryEntity> {
        return await this.categoryRepository.create(createCategoryDto);
    }

    async findAll(): Promise<CategoryEntity[]> {
        return await this.categoryRepository.find()
    }

    async findOneById(
        id: string
    ): Promise<CategoryEntity> {
        return await this.categoryRepository.findOne({ where: { id } })
    }

    async update(
        id: string,
        updateCategoryDto: CreateCategoryDto
    ): Promise<void> {
        return await this.categoryRepository.update({ id }, {
            ...updateCategoryDto
        });
    }

    async delete(
        id: string
    ): Promise<void> {
        return await this.categoryRepository.delete({ id })
    }
}