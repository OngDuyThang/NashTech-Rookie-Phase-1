import { Module } from "@nestjs/common";
import { ItemRepository } from "./repositories/item.repository";
import { DatabaseModule } from "@app/database";
import { ItemEntity } from "./entities/item.entity";
import { ItemService } from "./item.service";

@Module({
    imports: [
        DatabaseModule.forFeature([
            ItemEntity
        ])
    ],
    providers: [
        ItemService,
        ItemRepository
    ],
    exports: [
        ItemService
    ]
})
export class ItemModule {}