import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PaginationDto, PaginationPipe, UUIDPipe } from '@app/common';
import { AuthorEntity } from './entities/author.entity';
import { AuthorService } from './author.service';
import { ProductList } from '../product/entities/product-list.schema';
import { ProductRepository } from '../product/repositories/product.repository';

@Resolver(() => AuthorEntity)
export class AuthorResolver {
    constructor(
        private readonly authorService: AuthorService,
        private readonly productRepository: ProductRepository
    ) {}

    @Query(() => [AuthorEntity])
    async authors(): Promise<AuthorEntity[]> {
        return await this.authorService.findAll();
    }

    @Query(() => AuthorEntity)
    async author(
        @Args('id', UUIDPipe) id: string
    ): Promise<AuthorEntity> {
        return await this.authorService.findOneById(id);
    }

    @ResolveField(() => ProductList)
    async products(
        @Parent() author: AuthorEntity,
        @Args(PaginationPipe) paginationDto: PaginationDto
    ): Promise<ProductList> {
        const { page, limit } = paginationDto

        const [products, total] = await this.productRepository.findList({
            where: { author_id: author.id },
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