import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { getEnvFilePath } from '@app/common';
import { PageEntity } from '../modules/page/entities/page.entity';

dotenv.config({
  path: getEnvFilePath('asset'),
});

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [PageEntity],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
