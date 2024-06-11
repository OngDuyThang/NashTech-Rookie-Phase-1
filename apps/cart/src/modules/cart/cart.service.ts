import {
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CartEntity } from './entities/cart.entity';
import { CartRepository } from './repositories/cart.repository';
import { TempCartRepository } from './repositories/temp-cart.repository';
import { TempCartEntity } from './entities/temp-cart.entity';
import {
  ERROR_MESSAGE,
  PromotionEntity,
  QUERY_ORDER,
  SERVICE_MESSAGE,
  SERVICE_NAME,
  convertRpcException,
} from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { isEmpty } from 'lodash';
import { TimeoutError, catchError, lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly tempCartRepository: TempCartRepository,

    @Inject(SERVICE_NAME.PRODUCT_SERVICE)
    private readonly productService: ClientProxy,
  ) {}

  async create(userId: string): Promise<CartEntity> {
    return await this.cartRepository.create({
      user_id: userId,
    });
  }

  async createForGuest(guestId: string): Promise<TempCartEntity> {
    return await this.tempCartRepository.create({
      guest_id: guestId,
    });
  }

  async getUserCart(userId: string): Promise<CartEntity> {
    try {
      const cart = await this.cartRepository
        .createQueryBuilder()
        .leftJoinAndSelect('cart.items', 'items')
        .addSelect('cart.created_at')
        .where('cart.user_id = :userId', { userId })
        .orderBy('cart.created_at', QUERY_ORDER.DESC)
        .getOne();

      if (isEmpty(cart)) {
        return await this.create(userId);
      }
      return cart;
    } catch (e) {
      if (e instanceof NotFoundException) {
        return await this.create(userId);
      }
      throw e;
    }
  }

  async getGuestCart(guestId: string): Promise<TempCartEntity> {
    try {
      return await this.tempCartRepository.findOne({
        where: { guest_id: guestId },
        relations: {
          items: true,
        },
      });
    } catch (e) {
      if (e instanceof NotFoundException) {
        return await this.createForGuest(guestId);
      }
      throw e;
    }
  }

  async getUserCartCount(userId: string): Promise<number> {
    const cart = await this.getUserCart(userId);
    return cart.items?.length;
  }

  async getGuestCartCount(guestId: string): Promise<number> {
    const cart = await this.getGuestCart(guestId);
    return cart.items?.length;
  }

  async update(id: string, total: number): Promise<void> {
    await this.cartRepository.update({ id }, { total });
  }

  async updateGuestCart(id: string, total: number): Promise<void> {
    await this.tempCartRepository.update({ id }, { total });
  }

  async delete(id: string): Promise<void> {
    await this.cartRepository.delete({ id });
  }

  async deleteGuestCart(id: string): Promise<void> {
    await this.tempCartRepository.delete({ id });
  }

  async findCartForOrder(userId: string): Promise<CartEntity> {
    try {
      const cart = await this.cartRepository.findOne({
        where: { user_id: userId },
        relations: { items: true },
      });

      return cart;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  async placeOrder(cartId: string): Promise<boolean> {
    let queryRunner = this.cartRepository.createQueryRunner();
    if (queryRunner.isReleased) {
      queryRunner = this.cartRepository.createQueryRunner();
    }
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.delete(CartEntity, { id: cartId });
      await queryRunner.commitTransaction();

      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new RpcException(e);
    } finally {
      await queryRunner.release();
    }
  }

  async findOrderPromotion(total: number): Promise<PromotionEntity> {
    const _promotion = this.productService
      .send({ cmd: SERVICE_MESSAGE.FIND_ORDER_PROMOTION }, total)
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
      return (await lastValueFrom(_promotion)) as PromotionEntity;
    } catch (e) {
      throw e;
    }
  }
}
