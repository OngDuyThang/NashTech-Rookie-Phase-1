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
}