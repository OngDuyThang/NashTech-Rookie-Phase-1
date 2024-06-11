import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiController,
  PermissionRequestGuard,
  ROLE,
  Roles,
  RolesGuard,
  SERVICE_MESSAGE,
  UUIDPipe,
} from '@app/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dtos/create-promotion.dto';
import { PromotionEntity } from './entities/promotion.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiController('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @Roles([ROLE.ADMIN])
  @UseGuards(PermissionRequestGuard, RolesGuard)
  async create(
    @Body() createPromotionDto: CreatePromotionDto,
  ): Promise<PromotionEntity> {
    return await this.promotionService.create(createPromotionDto);
  }

  @Get()
  async findAll(): Promise<PromotionEntity[]> {
    return await this.promotionService.findAll();
  }

  @Get('/:id')
  async findOneById(
    @Param('id', UUIDPipe) id: string,
  ): Promise<PromotionEntity> {
    return await this.promotionService.findOneById(id);
  }

  @Patch('/:id')
  @Roles([ROLE.ADMIN])
  @UseGuards(PermissionRequestGuard, RolesGuard)
  async update(
    @Param('id', UUIDPipe) id: string,
    @Body() updatePromotionDto: CreatePromotionDto,
  ): Promise<void> {
    await this.promotionService.update(id, updatePromotionDto);
  }

  @Delete('/:id')
  @Roles([ROLE.ADMIN])
  @UseGuards(PermissionRequestGuard, RolesGuard)
  async delete(@Param('id', UUIDPipe) id: string): Promise<void> {
    await this.promotionService.delete(id);
  }

  @MessagePattern({ cmd: SERVICE_MESSAGE.FIND_ORDER_PROMOTION })
  async findOrderPromotion(@Payload() total: number): Promise<PromotionEntity> {
    return await this.promotionService.findOrderPromotion(total);
  }
}
