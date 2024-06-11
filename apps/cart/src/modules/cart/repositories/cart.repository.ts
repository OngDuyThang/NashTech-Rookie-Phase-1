import { AbstractRepository } from '@app/database';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '../entities/cart.entity';

@Injectable()
export class CartRepository extends AbstractRepository<CartEntity> {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {
    super(cartRepository);
  }

  createQueryBuilder() {
    return this.cartRepository.createQueryBuilder('cart');
  }
}
