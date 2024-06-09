import { Resolver, Query, Args } from '@nestjs/graphql';
import { CartEntity } from './entities/cart.entity';
import { CartService } from './cart.service';
import { UseGuards } from '@nestjs/common';
import { GetUser, NumberPipe, PermissionRequestGuard, ROLE, Roles, RolesGuard, UserEntity } from '@app/common';

@Roles([ROLE.USER])
@UseGuards(
    PermissionRequestGuard,
    RolesGuard
)
@Resolver(() => CartEntity)
export class CartResolver {
    constructor(
        private readonly cartService: CartService,
    ) {}

    @Query(() => CartEntity)
    async cart(
        @GetUser() user: UserEntity
    ): Promise<CartEntity> {
        return await this.cartService.getUserCart(user.id);
    }

    @Query(() => Number)
    async getUserCartCount(
        @GetUser() user: UserEntity
    ): Promise<number> {
        return await this.cartService.getUserCartCount(user.id);
    }

    @Query(() => Number)
    async findOrderPromotion(
        @Args('total', NumberPipe) total: number
    ): Promise<number> {
        const promotion = await this.cartService.findOrderPromotion(total);
        return promotion?.discount_percent || 0
    }
}