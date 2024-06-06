import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderItemEntity } from "../entities/item.entity";

@Injectable()
export class ItemRepository extends AbstractRepository<OrderItemEntity> {
    constructor(
        @InjectRepository(OrderItemEntity)
        private readonly itemRepository: Repository<OrderItemEntity>
    ) {
        super(itemRepository);
    }
}