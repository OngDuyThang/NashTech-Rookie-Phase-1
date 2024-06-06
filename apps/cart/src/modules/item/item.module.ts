import { Module } from "@nestjs/common";
import { ItemService } from "./item.service";
import { ItemResolver } from "./item.resolver";
import { CartModule } from "../cart/cart.module";
import { DatabaseModule } from "@app/database";
import { CartItemEntity } from "./entities/item.entity";
import { TempItemEntity } from "./entities/temp-item.entity";
import { ItemRepository } from "./repositories/item.repository";
import { TempItemRepository } from "./repositories/temp-item.repository";
import { TempItemResolver } from "./temp-item.resolver";
import { ItemController } from "./item.controller";

@Module({
    imports: [
        DatabaseModule.forFeature([
            CartItemEntity,
            TempItemEntity
        ]),
        CartModule
    ],
    controllers: [
        ItemController
    ],
    providers: [
        ItemService,
        ItemResolver,
        ItemRepository,
        TempItemRepository,
        TempItemResolver
    ]
})
export class ItemModule {}