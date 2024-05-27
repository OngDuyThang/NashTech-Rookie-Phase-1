import { Controller } from "@nestjs/common";
import { CartService } from "./cart.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { SERVICE_MESSAGE } from "@app/common";
import { CartEntity } from "./entities/cart.entity";

@Controller()
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) {}

    @MessagePattern({ cmd: SERVICE_MESSAGE.GET_CART_BY_USER })
    async findCartForOrder(
        @Payload() userId: string
    ): Promise<CartEntity> {
        return await this.cartService.findCartForOrder(userId);
    }

    @MessagePattern({ cmd: SERVICE_MESSAGE.DELETE_CART })
    async placeOrder(
        @Payload() cartId: string
    ): Promise<boolean> {
        return await this.cartService.placeOrder(cartId)
    }
}