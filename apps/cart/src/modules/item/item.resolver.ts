import { Resolver, Mutation, Args, Parent, ResolveField } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GetUser, NumberPipe, PermissionRequestGuard, ProductSchema, ROLE, Roles, RolesGuard, UUIDPipe, UserEntity } from '@app/common';
import { CartItemEntity } from './entities/item.entity';
import { ItemService } from './item.service';
import { CreateCartItemDto } from './dtos/create-item.dto';
import { Observable } from 'rxjs';

@Resolver(() => CartItemEntity)
export class ItemResolver {
    constructor(
        private readonly itemService: ItemService
    ) {}

    @Mutation(() => CartItemEntity)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async createCartItem(
        @GetUser() user: UserEntity,
        @Args('item') createItemDto: CreateCartItemDto
    ): Promise<CartItemEntity> {
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
        @Args('quantity', NumberPipe) quantity: number
    ): Promise<string> {
        await this.itemService.update(id, quantity);
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

    @ResolveField(() => ProductSchema)
    product(
        @Parent() item: CartItemEntity
    ): Observable<ProductSchema> {
        return this.itemService.findProductForCart(item.product_id)
    }
}