import { AbstractRepository } from '@app/database';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TempCartEntity } from '../entities/temp-cart.entity';

@Injectable()
export class TempCartRepository extends AbstractRepository<TempCartEntity> {
  constructor(
    @InjectRepository(TempCartEntity)
    private readonly tempCartRepository: Repository<TempCartEntity>,
  ) {
    super(tempCartRepository);
  }
}
