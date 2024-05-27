import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PaginationPipe, PermissionRequestGuard, ROLE, Roles, RolesGuard, UUIDPipe } from '@app/common';
import { ReviewService } from "./review.service";
import { ReviewEntity } from './entities/review.entity';
import { ReviewQueryDto } from './dtos/query.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(
        private readonly reviewService: ReviewService
    ) {}

    @Get('/all')
    async findAll(): Promise<ReviewEntity[]> {
        return await this.reviewService.findAll();
    }

    @Get()
    async findList(
        @Query(PaginationPipe) queryDto: ReviewQueryDto
    ): Promise<[ReviewEntity[], number]> {
        return await this.reviewService.findList(queryDto);
    }

    @Get('/:id')
    async findOneById(
        @Param('id', UUIDPipe) id: string
    ): Promise<ReviewEntity> {
        return await this.reviewService.findOneById(id);
    }

    @Delete('/:id')
    @Roles([ROLE.ADMIN])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async delete(
        @Param('id', UUIDPipe) id: string
    ): Promise<void> {
        await this.reviewService.delete(id)
    }
}