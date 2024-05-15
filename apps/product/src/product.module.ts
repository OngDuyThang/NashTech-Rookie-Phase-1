import { Logger, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from './database/data-source';
import { EnvModule } from '@app/env';
import { QUEUE_NAME, RmqClientOption, SERVICE_NAME, getEnvFilePath } from '@app/common';
import { EnvValidation } from './env.validation';
import { ProductRepository } from './repositories';
import { RmqModule } from '@app/rmq';
import { ProductEntity } from './entities';

const rmqClients: RmqClientOption[] = [
  {
    provide: SERVICE_NAME.AUTH_SERVICE,
    queueName: QUEUE_NAME.AUTH
  }
]

@Module({
  imports: [
    DatabaseModule.forRoot(dataSourceOptions),
    DatabaseModule.forFeature([ProductEntity]),
    EnvModule.forRoot(
      getEnvFilePath('product'),
      EnvValidation
    ),
    RmqModule.register(rmqClients)
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    Logger
  ],
})
export class ProductModule {}
