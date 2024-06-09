import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PromotionEntity } from "../entities/promotion.entity";

@Injectable()
export class PromotionRepository extends AbstractRepository<PromotionEntity> {
    constructor(
        @InjectRepository(PromotionEntity)
        private readonly promotionRepository: Repository<PromotionEntity>
    ) {
        super(promotionRepository);
    }

    createQueryBuilder() {
        return this.promotionRepository.createQueryBuilder('promotion');
    }
}