import { Mutation, Resolver, Query, Args } from "@nestjs/graphql";
import { OrderEntity } from "./entities/order.entity";
import { OrderService } from "./order.service";
import { UseGuards } from "@nestjs/common";
import { GetUser, PermissionRequestGuard, ROLE, Roles, RolesGuard, UserEntity } from "@app/common";
import { CreateOrderDto } from "./dtos/create-order.dto";
import { TPaymentResponse } from "./common";
import { UpdatePaymentStatusDto } from "./dtos/update-payment-status.dto";

@Resolver(() => OrderEntity)
export class OrderResolver {
    constructor(
        private readonly orderService: OrderService
    ) {}

    @Query(() => String)
    query() { return '' }

    @Mutation(() => TPaymentResponse)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async placeOrder(
        @GetUser() user: UserEntity,
        @Args('order') createOrderDto: CreateOrderDto
    ): Promise<TPaymentResponse> {
        return await this.orderService.placeOrder(user.id, createOrderDto);
    }

    @Mutation(() => String)
    @Roles([ROLE.USER])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async updatePaymentStatus(
        @Args() updatePaymentStatusDto: UpdatePaymentStatusDto
    ): Promise<string> {
        const { orderId, payment_status } = updatePaymentStatusDto
        await this.orderService.updatePaymentStatus(orderId, payment_status);
        return ''
    }
}