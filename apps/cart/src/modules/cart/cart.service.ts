import { Inject, Injectable, NotFoundException, RequestTimeoutException } from "@nestjs/common";
import { CartEntity } from "./entities/cart.entity";
import { CartRepository } from "./repositories/cart.repository";
import { TempCartRepository } from "./repositories/temp-cart.repository";
import { TempCartEntity } from "./entities/temp-cart.entity";
import { ERROR_MESSAGE, ProductSchema, SERVICE_MESSAGE, SERVICE_NAME, convertRpcException } from "@app/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { TimeoutError, catchError, lastValueFrom, timeout } from "rxjs";
import { cloneDeep, round } from "lodash";

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly tempCartRepository: TempCartRepository,
        @Inject(SERVICE_NAME.PRODUCT_SERVICE)
        private readonly productService: ClientProxy
    ) {}

    async create(
        userId: string
    ): Promise<CartEntity> {
        return await this.cartRepository.create({
            user_id: userId
        });
    }

    async createForGuest(
        guestId: string
    ): Promise<TempCartEntity> {
        return await this.tempCartRepository.create({
            guest_id: guestId
        });
    }

    async getUserCart(
        userId: string
    ): Promise<CartEntity> {
        try {
            return await this.cartRepository.findOne({
                where: { user_id: userId },
                relations: {
                    items: true
                }
            })
        } catch (e) {
            if (e instanceof NotFoundException) {
                return await this.create(userId)
            }
            throw e
        }
    }

    async getGuestCart(
        guestId: string
    ): Promise<TempCartEntity> {
        try {
            return await this.tempCartRepository.findOne({
                where: { guest_id: guestId },
                relations: {
                    items: true
                }
            })
        } catch (e) {
            if (e instanceof NotFoundException) {
                return await this.createForGuest(guestId)
            }
            throw e
        }
    }

    async getUserCartCount(
        userId: string
    ): Promise<number> {
        const cart = await this.getUserCart(userId);
        return cart.items.length;
    }

    async getGuestCartCount(
        guestId: string
    ): Promise<number> {
        const cart = await this.getGuestCart(guestId);
        return cart.items.length;
    }

    async update(
        id: string,
        total: number
    ): Promise<void> {
        await this.cartRepository.update({ id }, { total });
    }

    async updateGuestCart(
        id: string,
        total: number
    ): Promise<void> {
        await this.tempCartRepository.update({ id }, { total });
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.cartRepository.delete({ id });
    }

    async deleteGuestCart(
        id: string
    ): Promise<void> {
        await this.tempCartRepository.delete({ id });
    }

    async findCartForOrder(
        userId: string
    ): Promise<CartEntity> {
        try {
            const cart = await this.cartRepository.findOne({
                where: { user_id: userId },
                relations: { items: true }
            })
            let total = 0

            for (let i = 0; i < cart.items.length; i++) {
                const item = cart.items[i]

                const _product = this.productService.send({ cmd: SERVICE_MESSAGE.GET_PRODUCT_BY_ID }, item.product_id)
                    .pipe(
                        timeout(10000),
                        catchError(e => {
                            if (e instanceof TimeoutError) {
                                throw new RequestTimeoutException(ERROR_MESSAGE.TIME_OUT)
                            }
                            throw convertRpcException(e)
                        })
                    )

                const product = await lastValueFrom(_product) as ProductSchema
                item.product = cloneDeep(product)

                if (item?.product) {
                    const { price, discount } = item.product

                    if (discount) {
                        total += price * (discount / 100) * item.quantity
                    } else {
                        total += price * item.quantity
                    }
                }
            }

            cart.total = round(total, 2)
            return cart
        } catch (e) {
            throw new RpcException(e)
        }
    }

    async placeOrder(
        cartId: string
    ): Promise<boolean> {
        let queryRunner = this.cartRepository.createQueryRunner()
        if (queryRunner.isReleased) {
            queryRunner = this.cartRepository.createQueryRunner()
        }
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.delete(CartEntity, { id: cartId })
            await queryRunner.commitTransaction()

            return true
        } catch (e) {
            await queryRunner.rollbackTransaction()
            throw new RpcException(e)
        } finally {
            await queryRunner.release()
        }
    }
}