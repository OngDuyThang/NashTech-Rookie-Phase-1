import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import { AssetController } from './asset.controller';
import { APP_FILTER } from '@nestjs/core';
import {
  HttpExceptionFilter,
  LoggerMiddleware,
  QUEUE_NAME,
  RmqClientOption,
  SERVICE_NAME,
  getEnvFilePath,
} from '@app/common';
import { EnvModule } from '@app/env';
import { EnvValidation } from './env.validation';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from './database/data-source';
import { PageModule } from './modules/page/page.module';
import { RmqModule } from '@app/rmq';

const rmqClients: RmqClientOption[] = [
  {
    provide: SERVICE_NAME.AUTH_SERVICE,
    queueName: QUEUE_NAME.AUTH,
  },
];

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];

@Module({
  imports: [
    DatabaseModule.forRoot(dataSourceOptions),
    RmqModule.register(rmqClients),
    EnvModule.forRoot(getEnvFilePath('asset'), EnvValidation),
    PageModule,
  ],
  controllers: [AssetController],
  providers: [Logger, ...providers],
})
export class AssetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
