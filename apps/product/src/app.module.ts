import { Logger, MiddlewareConsumer, Module, NestModule, Provider } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from './database/data-source';
import { EnvModule } from '@app/env';
import { HttpExceptionFilter, LoggerMiddleware, RpcExceptionFilter, TypeORMExceptionFilter, getEnvFilePath, getGqlSchemaPath } from '@app/common';
import { GraphQLModule } from '@app/graphql';
import { RmqModule } from '@app/rmq';
import { QUEUE_NAME, RmqClientOption, SERVICE_NAME } from '@app/common';
import { EnvValidation } from './env.validation';
import { APP_FILTER } from '@nestjs/core';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { AuthorModule } from './modules/author/author.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { ReviewModule } from './modules/review/review.module';
import { PaginationMiddleware } from '@app/common/middlewares/pagination.middleware';
import { ProductController } from './modules/product/product.controller';

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
    EnvModule.forRoot(
      getEnvFilePath('product'),
      EnvValidation
    ),
    RmqModule.register(rmqClients),
    GraphQLModule.forRoot(
      getGqlSchemaPath('product')
    ),
    ProductModule,
    CategoryModule,
    AuthorModule,
    PromotionModule,
    ReviewModule
  ],
  providers: [
    Logger,
    ...providers
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');

    consumer
      .apply(PaginationMiddleware)
      .exclude('products/all', 'reviews/all', 'graphql')
      .forRoutes('*');
  }
}
