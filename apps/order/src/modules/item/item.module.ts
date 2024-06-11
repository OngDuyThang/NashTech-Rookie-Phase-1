import { Module } from '@nestjs/common';
import { ItemRepository } from './repositories/item.repository';
import { DatabaseModule } from '@app/database';
import { OrderItemEntity } from './entities/item.entity';
import { ItemService } from './item.service';

@Module({
  imports: [DatabaseModule.forFeature([OrderItemEntity])],
  providers: [ItemService, ItemRepository],
  exports: [ItemService],
})
export class ItemModule {}
