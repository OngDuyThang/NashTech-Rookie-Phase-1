import { Logger, Module, Provider } from '@nestjs/common';
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
import { APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from './database/data-source';
import { EnvModule } from '@app/env';
import { RmqModule } from '@app/rmq';
import { GraphQLModule } from '@app/graphql';
import { EnvValidation } from './env.validation';
import { CartModule } from './modules/cart/cart.module';
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
    provide: SERVICE_NAME.ORDER_SERVICE,
    queueName: QUEUE_NAME.ORDER,
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
    EnvModule.forRoot(getEnvFilePath('cart'), EnvValidation),
    RmqModule.register(rmqClients),
    GraphQLModule.forRoot(getGqlSchemaPath('cart')),
    CartModule,
    ItemModule,
  ],
  providers: [Logger, ...providers],
})
export class AppModule {}
