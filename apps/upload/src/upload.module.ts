import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import { UploadController } from './upload.controller';
import { S3Module } from '@app/s3';
import {
  HttpExceptionFilter,
  LoggerMiddleware,
  getEnvFilePath,
} from '@app/common';
import { APP_FILTER } from '@nestjs/core';
import { EnvModule } from '@app/env';
import { EnvValidation } from './env.validation';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];

@Module({
  imports: [
    S3Module,
    EnvModule.forRoot(getEnvFilePath('upload'), EnvValidation as any),
  ],
  controllers: [UploadController],
  providers: [Logger, ...providers],
})
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
