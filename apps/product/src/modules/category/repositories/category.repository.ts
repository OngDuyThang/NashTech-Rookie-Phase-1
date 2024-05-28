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

    async getAllSubcategoryIds(
        categoryId: string
    ): Promise<string[]> {
        try {
            const subcategories = await this.categoryRepository.manager.query(`
                WITH RECURSIVE subcategories AS (
                    SELECT id, parent_id
                    FROM product_category
                    WHERE id = $1
                    UNION ALL
                    SELECT c.id, c.parent_id
                    FROM product_category c
                    INNER JOIN subcategories s ON s.id = c.parent_id
                )
                SELECT id FROM subcategories;
            `, [categoryId]) as CategoryEntity[];

            const subcategoryIds = subcategories.map(subcat => subcat.id);
            return subcategoryIds
        } catch (e) {
            throw e
        }
    }
}