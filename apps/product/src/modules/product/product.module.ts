import { Logger, Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ProductEntity } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';
import { ProductResolver } from './product.resolver';
import { ReviewModule } from '../review/review.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    DatabaseModule.forFeature([
      ProductEntity
    ]),
    ScheduleModule.forRoot(),
    CacheModule.register(),
    CategoryModule,
    ReviewModule
  ],
  controllers: [
    ProductController
  ],
  providers: [
    ProductService,
    ProductRepository,
    ProductResolver,
    Logger
  ],
  exports: [
    ProductService,
    ProductRepository,
  ],
})
export class ProductModule {}
