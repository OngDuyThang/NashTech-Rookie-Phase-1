import { Resolver, Query, Args, Parent, ResolveField } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { ProductRepository } from '../product/repositories/product.repository';
import { PaginationDto, PaginationPipe, UUIDPipe } from '@app/common';
import { ProductList } from '../product/entities/product-list.schema';

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
    @Args('id', UUIDPipe) id: string
  ): Promise<CategoryEntity> {
    return await this.categoryService.findOneById(id);
  }

  @ResolveField(() => ProductList)
  async products(
    @Parent() category: CategoryEntity,
    @Args(PaginationPipe) paginationDto: PaginationDto
  ): Promise<ProductList> {
    const { page, limit } = paginationDto

    const [products, total] = await this.productRepository.findList({
      where: { category_id: category.id },
      skip: page * limit,
      take: limit
    });

    return {
      data: products,
      ...paginationDto,
      total
    }
  }
}