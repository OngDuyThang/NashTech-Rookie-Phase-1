import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/db/migrations/*.js"],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource