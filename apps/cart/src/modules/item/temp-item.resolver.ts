import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { NumberPipe, ProductSchema, UUIDPipe } from '@app/common';
import { ItemService } from './item.service';
import { CreateTempItemDto } from './dtos/create-temp-item.dto';
import { TempItemEntity } from './entities/temp-item.entity';
import { Observable } from 'rxjs';

@Resolver(() => TempItemEntity)
export class TempItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Mutation(() => TempItemEntity)
  async createCartItemForGuest(
    @Args('guestId', UUIDPipe) guestId: string,
    @Args('item') createTempItemDto: CreateTempItemDto,
  ): Promise<TempItemEntity> {
    return await this.itemService.createForGuest(guestId, createTempItemDto);
  }

  @Mutation(() => String)
  async updateCartItemForGuest(
    @Args('id', UUIDPipe) id: string,
    @Args('quantity', NumberPipe) quantity: number,
  ): Promise<string> {
    await this.itemService.updateForGuest(id, quantity);
    return '';
  }

  @Mutation(() => String)
  async deleteCartItemForGuest(
    @Args('id', UUIDPipe) id: string,
  ): Promise<string> {
    await this.itemService.deleteForGuest(id);
    return '';
  }

  // @ResolveField(() => ProductSchema)
  // product(
  //     @Parent() item: TempItemEntity
  // ): Observable<ProductSchema> {
  //     return this.itemService.findProductForCart(item.product_id)
  // }
}
