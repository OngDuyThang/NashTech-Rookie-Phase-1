import { Resolver, Query, Args, Parent, ResolveField } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { ProductRepository } from '../product/repositories/product.repository';
import { ProductEntity } from '../product/entities/product.entity';

@Resolver(() => CategoryEntity)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productRepository: ProductRepository
  ) {}

  @Query(() => [CategoryEntity])
  async categories(): Promise<CategoryEntity[]> {
    return await this.categoryService.findAll();
  }

  @Query(() => CategoryEntity)
  async category(
    @Args('id') id: string
  ): Promise<CategoryEntity> {
    return await this.categoryService.findOneById(id);
  }

  @ResolveField(() => [ProductEntity])
  async products(
    @Parent() category: CategoryEntity
  ): Promise<ProductEntity[]> {
    return await this.productRepository.find({ where: { category_id: category.id } });
  }
}