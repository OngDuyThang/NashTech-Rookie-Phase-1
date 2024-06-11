import { AbstractRepository } from '@app/database';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from '../entities/item.entity';

@Injectable()
export class ItemRepository extends AbstractRepository<CartItemEntity> {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly itemRepository: Repository<CartItemEntity>,
  ) {
    super(itemRepository);
  }
}
