import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
import { UseGuards } from '@nestjs/common';
import {
  GetUser,
  PermissionRequestGuard,
  ROLE,
  Roles,
  RolesGuard,
  UserEntity,
} from '@app/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { TPaymentResponse } from './common';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Resolver(() => OrderEntity)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => String)
  query() {
    return '';
  }

  @Mutation(() => TPaymentResponse)
  @Roles([ROLE.USER])
  @UseGuards(PermissionRequestGuard, RolesGuard)
  async placeOrder(
    @GetUser() user: UserEntity,
    @Args('order') createOrderDto: CreateOrderDto,
  ): Promise<TPaymentResponse> {
    return await this.orderService.placeOrder(user.id, createOrderDto);
  }

  @Mutation(() => String)
  @Roles([ROLE.USER])
  @UseGuards(PermissionRequestGuard, RolesGuard)
  async updatePaymentStatus(
    @Args() updatePaymentStatusDto: UpdateOrderDto,
  ): Promise<string> {
    const { orderId } = updatePaymentStatusDto;
    await this.orderService.update(orderId, updatePaymentStatusDto);
    return '';
  }

  @Query(() => [OrderEntity])
  @Roles([ROLE.USER])
  @UseGuards(PermissionRequestGuard, RolesGuard)
  async findAllByUserId(@GetUser() user: UserEntity): Promise<OrderEntity[]> {
    return await this.orderService.findAllByUserId(user.id);
  }
}
