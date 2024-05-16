import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "./repositories/category.repository";
import { CategoryController } from "./category.controller";
import { DatabaseModule } from "@app/database";
import { CategoryEntity } from "./entities/category.entity";
import { SubCategoryEntity } from "./entities/sub-category.entity";

@Module({
    imports: [
        DatabaseModule.forFeature([
            CategoryEntity,
            SubCategoryEntity
        ])
    ],
    controllers: [CategoryController],
    providers: [
        CategoryService,
        CategoryRepository
    ],
    exports: [CategoryService]
})
export class CategoryModule {}