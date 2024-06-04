import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "./repositories/category.repository";
import { CategoryController } from "./category.controller";
import { DatabaseModule } from "@app/database";
import { CategoryEntity } from "./entities/category.entity";
import { CategoryResolver } from "./category.resolver";
import { ProductModule } from "../product/product.module";

@Module({
    imports: [
        DatabaseModule.forFeature([
            CategoryEntity
        ]),
        ProductModule
    ],
    controllers: [
        CategoryController
    ],
    providers: [
        CategoryService,
        CategoryRepository,
        CategoryResolver
    ]
})
export class CategoryModule {}