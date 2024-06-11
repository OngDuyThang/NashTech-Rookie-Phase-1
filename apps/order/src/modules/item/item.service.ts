import { CartItemSchema } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ItemRepository } from './repositories/item.repository';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async create(orderId: string, cartItems: CartItemSchema[]): Promise<void> {
    for (let i = 0; i < cartItems?.length; i++) {
      const cartItem = cartItems[i];

      await this.itemRepository.create({
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        order_id: orderId,
      });
    }
  }
}
