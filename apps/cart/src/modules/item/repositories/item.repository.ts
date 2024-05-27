import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemEntity } from "../entities/item.entity";

@Injectable()
export class ItemRepository extends AbstractRepository<ItemEntity> {
    constructor(
        @InjectRepository(ItemEntity)
        private readonly itemRepository: Repository<ItemEntity>
    ) {
        super(itemRepository);
    }
}