import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { OrderRepository } from "./repositories/order.repository";
import { CartSchema, ERROR_MESSAGE, SERVICE_MESSAGE, SERVICE_NAME, convertRpcException } from "@app/common";
import { ClientProxy } from "@nestjs/microservices";
import { TimeoutError, catchError, lastValueFrom, timeout } from "rxjs";
import { ItemService } from "../item/item.service";
import { OrderEntity } from "./entities/order.entity";

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly itemService: ItemService,
        @Inject(SERVICE_NAME.CART_SERVICE)
        private readonly cartService: ClientProxy
    ) {}

    async findCartForOrder(
        userId: string
    ): Promise<CartSchema> {
        const _cart = this.cartService.send({ cmd: SERVICE_MESSAGE.GET_CART_BY_USER }, userId)
            .pipe(
                timeout(10000),
                catchError((e) => {
                    if (e instanceof TimeoutError) {
                        throw new RequestTimeoutException(ERROR_MESSAGE.TIME_OUT)
                    }
                    throw convertRpcException(e)
                })
            );

        return await lastValueFrom(_cart) as CartSchema
    }

    async create(
        userId: string
    ): Promise<void> {
        const cart = await this.findCartForOrder(userId)

        const queryRunner = this.orderRepository.rawQueryRunner
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            const order = queryRunner.manager.create(OrderEntity, {
                user_id: userId,
                total: cart.total
            })
            await queryRunner.manager.save(order)
            await this.itemService.create(order.id, cart.items)

            const _ok = this.cartService.send({ cmd: SERVICE_MESSAGE.DELETE_CART }, cart.id)
                .pipe(
                    timeout(10000),
                    catchError((e) => {
                        if (e instanceof TimeoutError) {
                            throw new RequestTimeoutException(ERROR_MESSAGE.TIME_OUT)
                        }
                        throw convertRpcException(e)
                    })
                );
            const ok = await lastValueFrom(_ok) as boolean

            if (ok) {
                await queryRunner.commitTransaction()
            }
        } catch (e) {
            await queryRunner.rollbackTransaction()
            throw e
        }
    }
}