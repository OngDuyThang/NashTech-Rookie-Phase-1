import { Resolver, Query, Args } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { UUIDPipe } from '@app/common';

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

  // @ResolveField(() => ProductList)
  // async products(
  //   @Parent() category: CategoryEntity,
  //   @Args(PaginationPipe) queryDto: SortQueryDto
  // ): Promise<ProductList> {
  //   const [products, total] = await this.categoryService.findProductsByCategory(
  //     category,
  //     queryDto
  //   );

  //   const { page, limit } = queryDto
  //   return {
  //     data: products,
  //     page,
  //     limit,
  //     total
  //   }
  // }
}