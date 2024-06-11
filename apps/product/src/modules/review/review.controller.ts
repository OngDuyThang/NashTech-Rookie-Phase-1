import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiController,
  ChangeStatusDto,
  PaginationPipe,
  PermissionRequestGuard,
  ROLE,
  Roles,
  RolesGuard,
  UUIDPipe,
} from '@app/common';
import { ReviewService } from './review.service';
import { ReviewEntity } from './entities/review.entity';
import { ReviewQueryDto } from './dtos/query.dto';

@ApiController('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/all')
  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewService.findAll();
  }

  @Get()
  async findList(
    @Query(PaginationPipe) queryDto: ReviewQueryDto,
  ): Promise<[ReviewEntity[], number]> {
    return await this.reviewService.findList(queryDto);
  }

  @Get('/:id')
  async findOneById(@Param('id', UUIDPipe) id: string): Promise<ReviewEntity> {
    return await this.reviewService.findOneById(id);
  }

  @Patch('/:id')
  @Roles([ROLE.ADMIN])
  @UseGuards(PermissionRequestGuard, RolesGuard)
  async changeStatus(
    @Param('id', UUIDPipe) id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ): Promise<void> {
    await this.reviewService.changeStatus(id, changeStatusDto);
  }

  @Delete('/:id')
  @Roles([ROLE.ADMIN])
  @UseGuards(PermissionRequestGuard, RolesGuard)
  async delete(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.reviewService.delete(id);
  }
}
