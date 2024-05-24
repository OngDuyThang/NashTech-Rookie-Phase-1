import { Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { ItemRepository } from "./repositories/item.repository";
import { ItemEntity } from "./entities/item.entity";
import { CreateItemDto } from "./dtos/create-item.dto";
import { TempItemRepository } from "./repositories/temp-item.repository";
import { CreateTempItemDto } from "./dtos/create-temp-item.dto";
import { CartService } from "../cart/cart.service";
import { ERROR_MESSAGE, ProductSchema, SERVICE_MESSAGE, SERVICE_NAME, convertRpcException } from "@app/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable, TimeoutError, catchError, lastValueFrom, timeout } from "rxjs";
import { TempItemEntity } from "./entities/temp-item.entity";

@Injectable()
export class ItemService {
    constructor(
        private readonly itemRepository: ItemRepository,
        private readonly tempItemRepository: TempItemRepository,
        private readonly cartService: CartService,
        @Inject(SERVICE_NAME.PRODUCT_SERVICE)
        private readonly productService: ClientProxy
    ) {}

    async create(
        userId: string,
        createItemDto: CreateItemDto
    ): Promise<ItemEntity> {
        const cart = await this.cartService.getUserCart(userId);

        this.findProductForCart(createItemDto.product_id)

        return await this.itemRepository.create({
            ...createItemDto,
            cart_id: cart.id
        });
    }

    async createForGuest(
        guestId: string,
        createTempItemDto: CreateTempItemDto
    ): Promise<TempItemEntity> {
        const temp_card = await this.cartService.getGuestCart(guestId);

        this.findProductForCart(createTempItemDto.product_id)

        return await this.tempItemRepository.create({
            ...createTempItemDto,
            temp_cart_id: temp_card.id
        });
    }

    async update(
        id: string,
        quantity: number
    ): Promise<void> {
        await this.itemRepository.update({ id }, { quantity });
    }

    async updateForGuest(
        id: string,
        quantity: number
    ): Promise<void> {
        await this.tempItemRepository.update({ id }, { quantity });
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.itemRepository.delete({ id });
    }

    async deleteForGuest(
        id: string
    ): Promise<void> {
        await this.tempItemRepository.delete({ id });
    }

    findProductForCart(
        productId: string
    ): Observable<ProductSchema> {
        return this.productService.send({ cmd: SERVICE_MESSAGE.GET_PRODUCT_BY_ID }, productId)
            .pipe(
                timeout(10000),
                catchError((e) => {
                    if (e instanceof TimeoutError) {
                        throw new RequestTimeoutException(ERROR_MESSAGE.TIME_OUT)
                    }
                    throw convertRpcException(e)
                })
            )
    }
}