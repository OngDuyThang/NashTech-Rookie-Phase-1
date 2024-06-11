import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionRepository } from './repositories/promotion.repository';
import { DatabaseModule } from '@app/database';
import { PromotionEntity } from './entities/promotion.entity';
import { PromotionResolver } from './promotion.resolver';
import { ProductModule } from '../product/product.module';
import { PromotionController } from './promotion.controller';

@Module({
  imports: [DatabaseModule.forFeature([PromotionEntity]), ProductModule],
  controllers: [PromotionController],
  providers: [PromotionService, PromotionRepository, PromotionResolver],
  exports: [PromotionService],
})
export class PromotionModule {}
