import { Resolver, Query, Args } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';

@Resolver(() => CategoryEntity)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  @Query(() => [CategoryEntity])
  findAll(): Promise<CategoryEntity[]> {
    return this.categoryService.findAll();
  }

  @Query(() => CategoryEntity)
  findOneById(
    @Args('id') id: string
  ): Promise<CategoryEntity> {
    return this.categoryService.findOneById(id);
  }
}