import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "../entities/category.entity";

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryEntity> {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>
    ) {
        super(categoryRepository);
    }
}