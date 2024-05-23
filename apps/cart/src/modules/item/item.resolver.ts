import { Resolver, Mutation, Args, Parent, ResolveField } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GetUser, NumberPipe, PermissionRequestGuard, ProductEntity, ROLE, Roles, RolesGuard, UUIDPipe, UserEntity } from '@app/common';
import { ItemEntity } from './entities/item.entity';
import { ItemService } from './item.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { Observable } from 'rxjs';

@Resolver(() => ItemEntity)
export class ItemResolver {
    constructor(
        private readonly itemService: ItemService
    ) {}

    @Mutation(() => ItemEntity)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async createCartItem(
        @GetUser() user: UserEntity,
        @Args('item') createItemDto: CreateItemDto
    ): Promise<ItemEntity> {
        return await this.itemService.create(user.id, createItemDto);
    }

    @Mutation(() => String)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async updateCartItem(
        @Args('id', UUIDPipe) id: string,
        @Args('quantity', NumberPipe) quantity: string
    ): Promise<string> {
        await this.itemService.update(id, Number(quantity));
        return ''
    }

    @Mutation(() => String)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async deleteCartItem(
        @Args('id', UUIDPipe) id: string
    ): Promise<string> {
        await this.itemService.delete(id);
        return ''
    }

    @ResolveField(() => ProductEntity)
    product(
        @Parent() item: ItemEntity
    ): Observable<ProductEntity> {
        return this.itemService.findProduct(item)
    }
}