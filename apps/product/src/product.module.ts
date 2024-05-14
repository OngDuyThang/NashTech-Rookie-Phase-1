import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from '../database/data-source';
import { EnvModule } from '@app/env';
import { getEnvFilePath } from '@app/common';
import { EnvValidation } from '../env.validation';
import { ProductRepository } from './repositories';

@Module({
  imports: [
    DatabaseModule.forRoot(dataSourceOptions),
    EnvModule.forRoot(
      getEnvFilePath('product'),
      EnvValidation
    ),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
