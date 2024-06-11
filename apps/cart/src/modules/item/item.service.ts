import {
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { ItemRepository } from './repositories/item.repository';
import { CartItemEntity } from './entities/item.entity';
import { CreateCartItemDto } from './dtos/create-item.dto';
import { TempItemRepository } from './repositories/temp-item.repository';
import { CreateTempItemDto } from './dtos/create-temp-item.dto';
import { CartService } from '../cart/cart.service';
import {
  ERROR_MESSAGE,
  ProductSchema,
  SERVICE_MESSAGE,
  SERVICE_NAME,
  convertRpcException,
} from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  Observable,
  TimeoutError,
  catchError,
  lastValueFrom,
  timeout,
} from 'rxjs';
import { TempItemEntity } from './entities/temp-item.entity';
import { round } from 'lodash';

@Injectable()
export class ItemService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly tempItemRepository: TempItemRepository,
    private readonly cartService: CartService,
    @Inject(SERVICE_NAME.PRODUCT_SERVICE)
    private readonly productService: ClientProxy,
  ) {}

  async create(
    userId: string,
    createItemDto: CreateCartItemDto,
  ): Promise<CartItemEntity> {
    const cart = await this.cartService.getUserCart(userId);
    const cartTotal = Number(cart.total);

    const product = await this.findProductForCart(createItemDto.product_id);

    try {
      const item = await this.itemRepository.findOne({
        where: {
          product_id: createItemDto.product_id,
        },
      });
      await this.update(item.id, item.quantity + createItemDto.quantity);
      const productPrice = product?.discount
        ? product?.price - (product?.price * product?.discount) / 100
        : product?.price;
      await this.cartService.update(
        cart.id,
        round(cartTotal + createItemDto.quantity * productPrice, 2),
      );

      item.quantity += createItemDto.quantity;
      return item;
    } catch (e) {
      if (e instanceof NotFoundException) {
        const item = await this.itemRepository.create({
          ...createItemDto,
          cart_id: cart.id,
        });
        const productPrice = product?.discount
          ? product?.price - (product?.price * product?.discount) / 100
          : product?.price;
        await this.cartService.update(
          cart.id,
          round(cartTotal + createItemDto.quantity * productPrice, 2),
        );

        return item;
      }
      throw e;
    }
  }

  async createForGuest(
    guestId: string,
    createTempItemDto: CreateTempItemDto,
  ): Promise<TempItemEntity> {
    const temp_card = await this.cartService.getGuestCart(guestId);

    this.findProductForCart(createTempItemDto.product_id);

    return await this.tempItemRepository.create({
      ...createTempItemDto,
      temp_cart_id: temp_card.id,
    });
  }

  async update(id: string, quantity: number): Promise<void> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: { cart: true },
    });
    const cartTotal = Number(item?.cart?.total);

    const product = await this.findProductForCart(item.product_id);
    const productPrice = product?.discount
      ? product?.price - (product?.price * product?.discount) / 100
      : product?.price;

    if (quantity > item.quantity) {
      await this.cartService.update(
        item.cart_id,
        round(cartTotal + (quantity - item.quantity) * productPrice, 2),
      );
    } else if (quantity < item.quantity) {
      await this.cartService.update(
        item.cart_id,
        round(cartTotal - (item.quantity - quantity) * productPrice, 2),
      );
    }

    await this.itemRepository.update({ id }, { quantity });
  }

  async updateForGuest(id: string, quantity: number): Promise<void> {
    await this.tempItemRepository.update({ id }, { quantity });
  }

  async delete(id: string): Promise<void> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: { cart: true },
    });
    const cartTotal = Number(item?.cart?.total);

    const product = await this.findProductForCart(item.product_id);
    const productPrice = product?.discount
      ? product?.price - (product?.price * product?.discount) / 100
      : product?.price;

    await this.cartService.update(
      item.cart_id,
      round(cartTotal - item.quantity * productPrice, 2),
    );

    await this.itemRepository.delete({ id });
  }

  async deleteForGuest(id: string): Promise<void> {
    await this.tempItemRepository.delete({ id });
  }

  async findProductForCart(productId: string): Promise<ProductSchema> {
    const _product = this.productService
      .send({ cmd: SERVICE_MESSAGE.GET_PRODUCT_BY_ID }, productId)
      .pipe(
        timeout(10000),
        catchError((e) => {
          if (e instanceof TimeoutError) {
            throw new RequestTimeoutException(ERROR_MESSAGE.TIME_OUT);
          }
          throw convertRpcException(e);
        }),
      );
    try {
      return (await lastValueFrom(_product)) as ProductSchema;
    } catch (e) {
      throw e;
    }
  }

  async removeCartItemForProduct(productId: string): Promise<boolean> {
    let queryRunner = this.itemRepository.createQueryRunner();
    if (queryRunner.isReleased) {
      queryRunner = this.itemRepository.createQueryRunner();
    }
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      queryRunner.manager.delete(CartItemEntity, { product_id: productId });
      await queryRunner.commitTransaction();

      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new RpcException(e);
    } finally {
      await queryRunner.release();
    }
  }
}
