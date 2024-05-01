import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { getEnvFilePath } from "@app/common";
import { UserEntity } from "../src/entities/user.entity";

dotenv.config({
    path: getEnvFilePath('auth')
});

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [UserEntity],
    // migrations: ["dist/apps/auth/database/migrations/*.js"],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource