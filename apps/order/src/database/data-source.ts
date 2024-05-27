import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { getEnvFilePath } from "@app/common";
import { OrderEntity } from "../modules/order/entities/order.entity";
import { ItemEntity } from "../modules/item/entities/item.entity";

dotenv.config({
    path: getEnvFilePath('order')
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
        OrderEntity,
        ItemEntity
    ],
    // migrations: ["dist/apps/auth/database/migrations/*.js"],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource