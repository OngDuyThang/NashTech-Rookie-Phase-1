import {
  HttpExceptionFilter,
  QUEUE_NAME,
  RmqClientOption,
  RpcExceptionFilter,
  SERVICE_NAME,
  TypeORMExceptionFilter,
  getEnvFilePath,
  getGqlSchemaPath,
} from '@app/common';
import { DatabaseModule } from '@app/database';
import { EnvModule } from '@app/env';
import { GraphQLModule } from '@app/graphql';
import { RmqModule } from '@app/rmq';
import { Logger, Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { dataSourceOptions } from './database/data-source';
import { EnvValidation } from './env.validation';
import { OrderModule } from './modules/order/order.module';
import { ItemModule } from './modules/item/item.module';

const rmqClients: RmqClientOption[] = [
  {
    provide: SERVICE_NAME.AUTH_SERVICE,
    queueName: QUEUE_NAME.AUTH,
  },
  {
    provide: SERVICE_NAME.PRODUCT_SERVICE,
    queueName: QUEUE_NAME.PRODUCT,
  },
  {
    provide: SERVICE_NAME.CART_SERVICE,
    queueName: QUEUE_NAME.CART,
  },
];

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: TypeORMExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: RpcExceptionFilter,
  },
];

@Module({
  imports: [
    DatabaseModule.forRoot(dataSourceOptions),
    EnvModule.forRoot(getEnvFilePath('order'), EnvValidation),
    RmqModule.register(rmqClients),
    GraphQLModule.forRoot(getGqlSchemaPath('order')),
    OrderModule,
    ItemModule,
  ],
  providers: [Logger, ...providers],
})
export class AppModule {}
