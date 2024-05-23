import { Injectable, NotFoundException } from "@nestjs/common";
import { CartEntity } from "./entities/cart.entity";
import { CartRepository } from "./repositories/cart.repository";
import { TempCartRepository } from "./repositories/temp-cart.repository";
import { TempCartEntity } from "./entities/temp-cart.entity";

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly tempCartRepository: TempCartRepository
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
        updateCartDto: any
    ): Promise<void> {
        await this.cartRepository.update({ id }, {
            ...updateCartDto
        });
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.cartRepository.delete({ id });
    }
}