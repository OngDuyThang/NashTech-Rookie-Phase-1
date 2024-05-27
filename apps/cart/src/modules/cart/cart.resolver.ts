import { Resolver, Query } from '@nestjs/graphql';
import { CartEntity } from './entities/cart.entity';
import { CartService } from './cart.service';
import { UseGuards } from '@nestjs/common';
import { GetUser, PermissionRequestGuard, ROLE, Roles, RolesGuard, UserEntity } from '@app/common';

@Resolver(() => CartEntity)
export class CartResolver {
    constructor(
        private readonly cartService: CartService,
    ) {}

    @Query(() => CartEntity)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async cart(
        @GetUser() user: UserEntity
    ): Promise<CartEntity> {
        return await this.cartService.getUserCart(user.id);
    }

    @Query(() => Number)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async getUserCartCount(
        @GetUser() user: UserEntity
    ): Promise<number> {
        return await this.cartService.getUserCartCount(user.id);
    }
}