import { DatabaseModule } from "@app/database";
import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderEntity } from "./entities/order.entity";
import { OrderRepository } from "./repositories/order.repository";
import { OrderResolver } from "./order.resolver";
import { ItemModule } from "../item/item.module";
import { OrderController } from "./order.controller";

@Module({
    imports: [
        DatabaseModule.forFeature([
            OrderEntity
        ]),
        ItemModule
    ],
    controllers: [
        OrderController
    ],
    providers: [
        OrderService,
        OrderRepository,
        OrderResolver
    ],
    exports: [
        OrderService
    ]
})
export class OrderModule {}