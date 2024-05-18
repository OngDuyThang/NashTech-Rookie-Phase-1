import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ProductEntity } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [
    DatabaseModule.forFeature([ProductEntity]),
  ],
  controllers: [
    ProductController
  ],
  providers: [
    ProductService,
    ProductRepository,
    ProductResolver
  ],
  exports: [
    ProductService,
    ProductRepository,
  ],
})
export class ProductModule {}
