import { ApiController, ChangeStatusDto, PermissionRequestGuard, ROLE, Roles, RolesGuard, UUIDPipe } from "@app/common";
import { OrderService } from "./order.service";
import { Body, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { OrderEntity } from "./entities/order.entity";

@ApiController('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {}

    @Get()
    async findAll(): Promise<OrderEntity[]> {
        return await this.orderService.findAll()
    }

    @Get('/:id')
    async findOneById(
        @Param('id', UUIDPipe) id: string,
    ): Promise<OrderEntity> {
        return await this.orderService.findOneById(id)
    }

    @Patch('/:id')
    @Roles([ROLE.ADMIN])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async changeStatus(
        @Param('id', UUIDPipe) id: string,
        @Body() changeStatusDto: ChangeStatusDto
    ): Promise<void> {
        await this.orderService.changeStatus(id, changeStatusDto)
    }

    @Delete('/:id')
    @Roles([ROLE.ADMIN])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async delete(
        @Param('id', UUIDPipe) id: string
    ): Promise<void> {
        await this.orderService.delete(id)
    }
}