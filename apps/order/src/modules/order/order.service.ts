import { BadRequestException, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { OrderRepository } from "./repositories/order.repository";
import { CartSchema, ERROR_MESSAGE, QUERY_ORDER, SERVICE_MESSAGE, SERVICE_NAME, convertRpcException } from "@app/common";
import { ClientProxy } from "@nestjs/microservices";
import { TimeoutError, catchError, lastValueFrom, timeout } from "rxjs";
import { ItemService } from "../item/item.service";
import { OrderEntity } from "./entities/order.entity";
import { isEmpty } from "lodash";
import { CreateOrderDto } from "./dtos/create-order.dto";
import Stripe from 'stripe';
import { Env } from "@app/env";
import { PAYMENT_METHOD, PAYMENT_STATUS, TPaymentResponse } from "./common";

@Injectable()
export class OrderService {
    private readonly stripe: Stripe;

    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly itemService: ItemService,
        @Inject(SERVICE_NAME.CART_SERVICE)
        private readonly cartService: ClientProxy,
        private readonly env: Env,
    ) {
        this.stripe = new Stripe(
            this.env.STRIPE_SECRET_KEY,
            { apiVersion: '2024-04-10' }
        )
    }

    async findCart(
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

    async placeOrder(
        userId: string,
        createOrderDto: CreateOrderDto
    ): Promise<TPaymentResponse> {
        const order = await this.createOrder(userId, createOrderDto)

        const { payment_method } = createOrderDto
        switch (payment_method) {
            case PAYMENT_METHOD.COD:
                return {
                    clientSecret: '',
                    orderId: ''
                }
            case PAYMENT_METHOD.STRIPE:
                return await this.createStripePayment(order.id, order.total)
        }
    }

    private async createOrder(
        userId: string,
        createOrderDto: CreateOrderDto
    ): Promise<OrderEntity> {
        const cart = await this.findCart(userId)
        if (isEmpty(cart.items)) {
            throw new BadRequestException(ERROR_MESSAGE.EMPTY_CART)
        }

        let queryRunner = this.orderRepository.createQueryRunner()
        if (queryRunner.isReleased) {
            queryRunner = this.orderRepository.createQueryRunner()
        }
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            const order = queryRunner.manager.create(OrderEntity, {
                user_id: userId,
                total: cart.total,
                ...createOrderDto
            })
            await queryRunner.manager.save(order)

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
                await this.itemService.create(order.id, cart.items)
                return order
            }
        } catch (e) {
            await queryRunner.rollbackTransaction()
            throw e
        } finally {
            await queryRunner.release()
        }
    }

    private async createStripePayment(
        orderId: string,
        amount: number
    ): Promise<TPaymentResponse> {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: 'usd'
        });

        return {
            clientSecret: paymentIntent.client_secret,
            orderId
        }
    }

    async findAll(): Promise<OrderEntity[]> {
        try {
            return await this.orderRepository.createQueryBuilder()
                .addSelect('order.created_at')
                .orderBy('order.created_at', QUERY_ORDER.DESC)
                .getMany()
        } catch (e) {
            throw e
        }
    }

    async findOneById(
        id: string
    ): Promise<OrderEntity> {
        return await this.orderRepository.findOne({
            where: { id },
            relations: { items: true }
        })
    }

    async updatePaymentStatus(
        id: string,
        paymentStatus: PAYMENT_STATUS
    ): Promise<void> {
        await this.orderRepository.update({ id }, {
            payment_status: paymentStatus
        })
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.orderRepository.delete({ id })
    }

    async getPopularProducts(): Promise<string[]> {
        try {
            const result = await this.orderRepository.createQueryBuilder()
                .leftJoinAndSelect('order.items', 'items')
                .select('items.product_id', 'product_id')
                .addSelect('COUNT(*)', 'total')
                .groupBy('items.product_id')
                .orderBy('total', QUERY_ORDER.DESC)
                .limit(20)
                .getRawMany()

            return result.map(item => item?.product_id)
        } catch (e) {
            throw e
        }
    }
}