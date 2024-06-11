import { AbstractRepository } from '@app/database';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEntity } from '../entities/page.entity';

@Injectable()
export class PageRepository extends AbstractRepository<PageEntity> {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pageRepository: Repository<PageEntity>,
  ) {
    super(pageRepository);
  }
}
