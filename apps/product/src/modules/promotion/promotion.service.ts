import { Injectable } from "@nestjs/common";
import { PromotionRepository } from "./repositories/promotion.repository";
import { PromotionEntity } from "./entities/promotion.entity";
import { CreatePromotionDto } from "./dtos/create-promotion.dto";

@Injectable()
export class PromotionService {
    constructor(
        private readonly promotionRepository: PromotionRepository
    ) {}

    async create(
        createPromotionDto: CreatePromotionDto
    ): Promise<PromotionEntity> {
        return await this.promotionRepository.create(createPromotionDto);
    }

    async findAll(): Promise<PromotionEntity[]> {
        return await this.promotionRepository.find({
            relations: {
                products: true
            }
        });
    }
}