import { Injectable } from "@nestjs/common";
import { PromotionRepository } from "./repositories/promotion.repository";
import { PromotionEntity } from "./entities/promotion.entity";
import { CreatePromotionDto } from "./dtos/create-promotion.dto";
import { RpcException } from "@nestjs/microservices";
import { PROMOTION_CONDITION, PROMOTION_LEVEL, QUERY_ORDER } from "@app/common";

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
        return await this.promotionRepository.find();
    }

    async findOneById(
        id: string
    ): Promise<PromotionEntity> {
        return await this.promotionRepository.findOne({
            where: { id },
            relations: { products: true }
        });
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

    async findOrderPromotion(
        total: number
    ): Promise<PromotionEntity> {
        try {
            return this.promotionRepository.createQueryBuilder()
                .where('promotion.level = :level', { level: PROMOTION_LEVEL.ORDER })
                .andWhere('promotion.condition = :condition', { condition: PROMOTION_CONDITION.AT_LEAST })
                .andWhere('promotion.min_value <= :total', { total })
                .orderBy('promotion.discount_percent', QUERY_ORDER.DESC)
                .take(1)
                .getOne();
        } catch (e) {
            throw new RpcException(e)
        }
    }
}