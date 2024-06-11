import { Resolver, Query, Args } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { UUIDPipe } from '@app/common';
import { TempCartEntity } from './entities/temp-cart.entity';

@Resolver(() => TempCartEntity)
export class TempCartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => TempCartEntity)
  async cartForGuest(
    @Args('guestId', UUIDPipe) guestId: string,
  ): Promise<TempCartEntity> {
    return await this.cartService.getGuestCart(guestId);
  }

  @Query(() => Number)
  async getGuestCartCount(
    @Args('guestId', UUIDPipe) guestId: string,
  ): Promise<number> {
    return await this.cartService.getGuestCartCount(guestId);
  }
}
