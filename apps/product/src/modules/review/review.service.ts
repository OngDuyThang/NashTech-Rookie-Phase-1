import { Injectable } from "@nestjs/common";
import { ReviewRepository } from "./repositories/review.repository";
import { ReviewEntity } from "./entities/review.entity";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { PaginationDto } from "@app/common";

@Injectable()
export class ReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository
    ) {}

    async create(
        userId: string,
        createReviewDto: CreateReviewDto
    ): Promise<ReviewEntity> {
        return await this.reviewRepository.create({
            ...createReviewDto,
            user_id: userId
        });
    }

    async findAll(): Promise<ReviewEntity[]> {
        return await this.reviewRepository.find();
    }

    async findList(
        paginationDto: PaginationDto
    ): Promise<[ReviewEntity[], number]> {
        const { page, limit } = paginationDto

        return await this.reviewRepository.findList({
            skip: page * limit,
            take: limit
        });
    }

    async findOneById(
        id: string
    ): Promise<ReviewEntity> {
        return await this.reviewRepository.findOne({ where: { id } });
    }

    async update(
        id: string,
        updateReviewDto: UpdateReviewDto
    ): Promise<void> {
        await this.reviewRepository.update({ id }, {
            ...updateReviewDto
        });
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.reviewRepository.delete({ id });
    }
}