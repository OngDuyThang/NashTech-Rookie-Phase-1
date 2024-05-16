import { Module } from "@nestjs/common";
import { PromotionService } from "./promotion.service";
import { PromotionRepository } from "./repositories/promotion.repository";
import { DatabaseModule } from "@app/database";
import { PromotionEntity } from "./entities/promotion.entity";

@Module({
    imports: [
        DatabaseModule.forFeature([PromotionEntity])
    ],
    providers: [PromotionService, PromotionRepository],
    exports: [PromotionService]
})
export class PromotionModule {}