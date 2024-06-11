import { Args, Query, Resolver } from '@nestjs/graphql';
import { UUIDPipe } from '@app/common';
import { AuthorEntity } from './entities/author.entity';
import { AuthorService } from './author.service';

@Resolver(() => AuthorEntity)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Query(() => [AuthorEntity])
  async authors(): Promise<AuthorEntity[]> {
    return await this.authorService.findAll();
  }

  @Query(() => AuthorEntity)
  async author(@Args('id', UUIDPipe) id: string): Promise<AuthorEntity> {
    return await this.authorService.findOneById(id);
  }

  // @ResolveField(() => ProductList)
  // async products(
  //     @Parent() author: AuthorEntity,
  //     @Args(PaginationPipe) queryDto: SortQueryDto
  // ): Promise<ProductList> {
  //     const [products, total] = await this.authorService.findProductsByAuthor(
  //         author,
  //         queryDto
  //     );

  //     const { page, limit } = queryDto
  //     return {
  //         data: products,
  //         page,
  //         limit,
  //         total
  //     }
  // }
}
