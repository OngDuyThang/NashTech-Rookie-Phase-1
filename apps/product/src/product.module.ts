import { Logger, Module, Provider } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from './database/data-source';
import { EnvModule } from '@app/env';
import { HttpExceptionFilter, QUEUE_NAME, RmqClientOption, RpcExceptionFilter, SERVICE_NAME, TypeORMExceptionFilter, getEnvFilePath } from '@app/common';
import { EnvValidation } from './env.validation';
import { ProductRepository } from './repositories';
import { RmqModule } from '@app/rmq';
import { ProductEntity } from './entities';
import { APP_FILTER } from '@nestjs/core';

const rmqClients: RmqClientOption[] = [
  {
    provide: SERVICE_NAME.AUTH_SERVICE,
    queueName: QUEUE_NAME.AUTH
  }
]

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  },
  {
    provide: APP_FILTER,
    useClass: TypeORMExceptionFilter
  },
  {
    provide: APP_FILTER,
    useClass: RpcExceptionFilter
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
    Logger,
    ...providers
  ],
})
export class ProductModule {}
