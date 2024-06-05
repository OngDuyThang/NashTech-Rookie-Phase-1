import { Injectable } from "@nestjs/common";
import { ReviewRepository } from "./repositories/review.repository";
import { ReviewEntity } from "./entities/review.entity";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { ChangeStatusDto, QUERY_ORDER, STATUS } from "@app/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../product/entities/product.entity";
import { ReviewQueryDto } from "./dtos/query.dto";
import { REVIEW_SORT } from "./common";

@Injectable()
export class ReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository,
        @InjectRepository(ReviewEntity)
        private readonly reviewOrgRepo: Repository<ReviewEntity>
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
        return await this.reviewRepository.find({
            relations: {
                product: true
            }
        });
    }

    async findList(
        queryDto: ReviewQueryDto
    ): Promise<[ReviewEntity[], number]> {
        const { page, limit, sort } = queryDto
        const order = sort == REVIEW_SORT.DATE_ASC ? QUERY_ORDER.ASC : QUERY_ORDER.DESC

        try {
            return await this.reviewRepository.createQueryBuilder()
                .leftJoinAndSelect('review.product', 'product')
                .addSelect('review.created_at')
                .skip(page * limit)
                .take(limit)
                .orderBy('review.created_at', order)
                .getManyAndCount()
        } catch (e) {
            throw e
        }
    }

    async findOneById(
        id: string
    ): Promise<ReviewEntity> {
        return await this.reviewRepository.findOne({
            where: { id },
            relations: { product: true }
        });
    }

    async update(
        id: string,
        updateReviewDto: UpdateReviewDto
    ): Promise<void> {
        await this.reviewRepository.update({ id }, {
            ...updateReviewDto
        });
    }

    async changeStatus(
        id: string,
        changeStatusDto: ChangeStatusDto
    ): Promise<void> {
        const { status } = changeStatusDto
        await this.reviewRepository.update({ id }, {
            status
        })
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.reviewRepository.delete({ id });
    }

    // async getProductRating(
    //     productId: string
    // ): Promise<number> {
    //     try {
    //         const raw = await this.reviewOrgRepo.createQueryBuilder('review')
    //             .select('AVG(review.rating)', 'avg_rating')
    //             .where('review.product_id = :productId', { productId })
    //             .getRawOne()

    //         const decimal = Number(raw.avg_rating).toFixed(1)
    //         return Number(decimal)
    //     } catch (e) {
    //         throw e
    //     }
    // }

    async getProductRatings(
        productId: string
    ): Promise<number[]> {
        try {
            const ratings = await this.reviewOrgRepo.createQueryBuilder('review')
                .select('review.rating', 'star')
                .addSelect('COUNT(review.rating)', 'count')
                .where('review.product_id = :productId', { productId })
                .groupBy('star')
                .getRawMany()

            if (!ratings.length) {
                return new Array(5).fill(0)
            }

            return ratings.reduce((result, rating) => {
                result[rating.star - 1] = Number(rating.count)
                return result
            }, new Array(5).fill(0))
        } catch (e) {
            throw e
        }
    }

    getAverageRating(
        ratings: number[]
    ): number {
        const totalReview = ratings.reduce((result, item) => {
            result += item
            return result
        }, 0)

        if (!totalReview) {
            return 0
        }

        const totalStar = ratings.reduce((result, item, index) => {
            result += item * (index + 1)
            return result
        }, 0)

        const decimal = Number(totalStar / totalReview).toFixed(1)
        return Number(decimal)
    }

    async getReviewsOfProduct(
        product: ProductEntity,
        page: number,
        limit: number,
        order: QUERY_ORDER,
        star: number
    ): Promise<[ReviewEntity[], number]> {
        try {
            return await this.reviewOrgRepo.createQueryBuilder('review')
                .addSelect('review.created_at')
                .where('review.product_id = :productId', { productId: product.id })
                .andWhere('review.rating = :star', { star })
                .andWhere('review.status = :status', { status: STATUS.CONFIRMED })
                .orderBy('review.created_at', order)
                .skip(page * limit)
                .take(limit)
                .getManyAndCount()
        } catch (e) {
            throw e
        }
    }
}