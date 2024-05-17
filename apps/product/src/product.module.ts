import { Logger, Module, Provider } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductEntity } from './common/entities';
import { ProductRepository } from './common/repositories';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from './database/data-source';
import { EnvModule } from '@app/env';
import { HttpExceptionFilter, QUEUE_NAME, RmqClientOption, RpcExceptionFilter, SERVICE_NAME, TypeORMExceptionFilter, getEnvFilePath, getGqlSchemaPath } from '@app/common';
import { EnvValidation } from './env.validation';
import { RmqModule } from '@app/rmq';
import { APP_FILTER } from '@nestjs/core';
import { PromotionModule } from './modules/promotion';
import { CategoryModule } from './modules/category';
import { AuthorModule } from './modules/author';
import { ReviewModule } from './modules/review';
import { GraphQLModule } from '@app/graphql';

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
    RmqModule.register(rmqClients),
    GraphQLModule.forRoot(
      getGqlSchemaPath('product')
    ),
    AuthorModule,
    CategoryModule,
    PromotionModule,
    ReviewModule,
    ProductModule
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
