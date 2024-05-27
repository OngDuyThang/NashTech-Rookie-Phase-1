import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { getEnvFilePath } from "@app/common";
import { ProductEntity } from "../modules/product/entities/product.entity";
import { CategoryEntity } from "../modules/category/entities/category.entity";
import { AuthorEntity } from "../modules/author/entities/author.entity";
import { PromotionEntity } from "../modules/promotion/entities/promotion.entity";
import { ReviewEntity } from "../modules/review/entities/review.entity";

dotenv.config({
    path: getEnvFilePath('product')
});

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [
        ProductEntity,
        CategoryEntity,
        AuthorEntity,
        PromotionEntity,
        ReviewEntity
        // 'dist/apps/product/**/*.entity.js'
    ],
    // migrations: ["dist/apps/auth/database/migrations/*.js"],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource