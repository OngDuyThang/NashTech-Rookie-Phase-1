import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../entities/order.entity";

@Injectable()
export class OrderRepository extends AbstractRepository<OrderEntity> {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>
    ) {
        super(orderRepository);
    }
}