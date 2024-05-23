import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { getEnvFilePath } from "@app/common";
import { CartEntity } from "../modules/cart/entities/cart.entity";
import { ItemEntity } from "../modules/item/entities/item.entity";
import { TempCartEntity } from "../modules/cart/entities/temp-cart.entity";
import { TempItemEntity } from "../modules/item/entities/temp-item.entity";

dotenv.config({
    path: getEnvFilePath('cart')
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
        CartEntity,
        ItemEntity,
        TempCartEntity,
        TempItemEntity
        // 'dist/apps/cart/**/*.entity.js'
    ],
    // migrations: ["dist/apps/auth/database/migrations/*.js"],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource