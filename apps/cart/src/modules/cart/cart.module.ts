import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartRepository } from './repositories/cart.repository';
import { CartResolver } from './cart.resolver';
import { DatabaseModule } from '@app/database';
import { CartEntity } from './entities/cart.entity';
import { TempCartRepository } from './repositories/temp-cart.repository';
import { TempCartEntity } from './entities/temp-cart.entity';
import { TempCartResolver } from './temp-cart.resolver';
import { CartController } from './cart.controller';

@Module({
  imports: [DatabaseModule.forFeature([CartEntity, TempCartEntity])],
  controllers: [CartController],
  providers: [
    CartService,
    CartRepository,
    CartResolver,
    TempCartRepository,
    TempCartResolver,
  ],
  exports: [CartService],
})
export class CartModule {}
