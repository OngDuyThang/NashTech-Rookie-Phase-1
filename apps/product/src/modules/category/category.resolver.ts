import { Resolver, Query, Args, Parent, ResolveField } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { PaginationPipe, UUIDPipe } from '@app/common';
import { ProductList } from '../product/entities/product-list.schema';
import { SortQueryDto } from '../product/dtos/query.dto';

@Resolver(() => CategoryEntity)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,

  ) {}

  @Query(() => [CategoryEntity])
  async categories(): Promise<CategoryEntity[]> {
    return await this.categoryService.findAll();
  }

  @Query(() => CategoryEntity)
  async category(
    @Args('id', UUIDPipe) id: string
  ): Promise<CategoryEntity> {
    return await this.categoryService.findOneById(id);
  }

  @ResolveField(() => ProductList)
  async products(
    @Parent() category: CategoryEntity,
    @Args(PaginationPipe) queryDto: SortQueryDto
  ): Promise<ProductList> {
    const [products, total] = await this.categoryService.findProductsByCategory(
      category,
      queryDto
    );

    const { page, limit } = queryDto
    return {
      data: products,
      page,
      limit,
      total
    }
  }
}