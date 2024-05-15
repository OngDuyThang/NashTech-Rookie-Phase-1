import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { RmqService } from '@app/rmq';
import { QUEUE_NAME, RpcExceptionFilter } from '@app/common';
import { Logger } from '@nestjs/common';
import { Env } from '@app/env';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const logger = app.get(Logger);
  const env = app.get(Env)
  const rmqService = app.get(RmqService);
  app.useGlobalFilters(new RpcExceptionFilter())

  app.connectMicroservice(
    rmqService.getMicroserviceOptions(
      QUEUE_NAME.PRODUCT
    )
  )

  app.enableCors({
    origin: true,
    credentials: true
  });

  app.use(cookieParser());

  await app.startAllMicroservices()
  await app.listen(env.SERVICE_PORT);
  logger.log(`Product service is listening on port ${env.SERVICE_PORT}`);
}
bootstrap();
