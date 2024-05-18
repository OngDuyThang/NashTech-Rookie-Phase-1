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

    async findOneById(
        id: string
    ): Promise<PromotionEntity> {
        return await this.promotionRepository.findOne({ where: { id } });
    }

    async update(
        id: string,
        updatePromotionDto: CreatePromotionDto
    ): Promise<void> {
        await this.promotionRepository.update({ id }, {
            ...updatePromotionDto
        });
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.promotionRepository.delete({ id });
    }
}