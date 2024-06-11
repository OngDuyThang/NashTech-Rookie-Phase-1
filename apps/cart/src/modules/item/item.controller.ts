import { Controller } from '@nestjs/common';
import { ItemService } from './item.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SERVICE_MESSAGE } from '@app/common';

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @MessagePattern({ cmd: SERVICE_MESSAGE.REMOVE_CART_ITEM })
  async removeCartItemForProduct(
    @Payload() productId: string,
  ): Promise<boolean> {
    return await this.itemService.removeCartItemForProduct(productId);
  }
}
