import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "../entities/category.entity";
import { isEmpty } from "lodash";

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryEntity> {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>
    ) {
        super(categoryRepository);
    }

    async getAllSubcategoryIds(
        categoryIds: string[]
    ): Promise<string[]> {
        if (isEmpty(categoryIds)) return [];

        try {
            const subcategories = await this.categoryRepository.manager.query(`
                WITH RECURSIVE subcategories AS (
                    SELECT id, parent_id
                    FROM product_category
                    WHERE id = ANY($1)
                    UNION ALL
                    SELECT c.id, c.parent_id
                    FROM product_category c
                    INNER JOIN subcategories s ON s.id = c.parent_id
                )
                SELECT id FROM subcategories;
            `, [categoryIds]) as CategoryEntity[]

            const subcategoryIds = subcategories?.map(subcat => subcat.id) || [];
            return subcategoryIds
        } catch (e) {
            throw e
        }
    }
}