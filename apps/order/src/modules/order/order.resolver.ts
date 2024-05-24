import { Mutation, Resolver, Query } from "@nestjs/graphql";
import { OrderEntity } from "./entities/order.entity";
import { OrderService } from "./order.service";
import { UseGuards } from "@nestjs/common";
import { GetUser, PermissionRequestGuard, ROLE, Roles, RolesGuard, UserEntity } from "@app/common";

@Resolver(() => OrderEntity)
export class OrderResolver {
    constructor(
        private readonly orderService: OrderService
    ) {}

    @Query(() => String)
    query() { return '' }

    @Mutation(() => String)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async createOrder(
        @GetUser() user: UserEntity
    ): Promise<string> {
        await this.orderService.create(user.id);
        return ''
    }
}