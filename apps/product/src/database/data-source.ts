import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { getEnvFilePath } from "@app/common";
import { ProductEntity } from "../common/entities";
import { AuthorEntity } from "../modules/author";
import { PromotionEntity } from "../modules/promotion";
import { ReviewEntity } from "../modules/review";
import { CategoryEntity } from "../modules/category";

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
    ],
    // migrations: ["dist/apps/auth/database/migrations/*.js"],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource