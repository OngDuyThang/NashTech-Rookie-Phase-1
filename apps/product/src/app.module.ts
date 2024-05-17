import { Logger, Module, Provider } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from './database/data-source';
import { EnvModule } from '@app/env';
import { HttpExceptionFilter, RpcExceptionFilter, TypeORMExceptionFilter, getEnvFilePath, getGqlSchemaPath } from '@app/common';
import { GraphQLModule } from '@app/graphql';
import { RmqModule } from '@app/rmq';
import { QUEUE_NAME, RmqClientOption, SERVICE_NAME } from '@app/common';
import { EnvValidation } from './env.validation';
import { APP_FILTER } from '@nestjs/core';
import { PromotionModule } from './modules/promotion';
import { CategoryModule } from './modules/category';
import { AuthorModule } from './modules/author';
import { ReviewModule } from './modules/review';
import { ProductModule } from './modules/product';

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
    AuthorModule,
    CategoryModule,
    PromotionModule,
    ReviewModule
  ],
  controllers: [],
  providers: [
    Logger,
    ...providers
  ],
})
export class AppModule {}
