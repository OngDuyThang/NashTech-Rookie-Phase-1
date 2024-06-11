import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewsController } from './review.controller';
import { DatabaseModule } from '@app/database';
import { ReviewEntity } from './entities/review.entity';
import { ReviewResolver } from './review.resolver';

@Module({
  imports: [DatabaseModule.forFeature([ReviewEntity])],
  controllers: [ReviewsController],
  providers: [ReviewService, ReviewRepository, ReviewResolver],
  exports: [ReviewService],
})
export class ReviewModule {}
