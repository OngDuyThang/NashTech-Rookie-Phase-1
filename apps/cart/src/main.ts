import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Env } from '@app/env';
import { RmqService } from '@app/rmq';
import { QUEUE_NAME, ReshapeDataInteceptor } from '@app/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  const env = app.get(Env);
  const rmqService = app.get(RmqService);

  app.connectMicroservice(rmqService.getMicroserviceOptions(QUEUE_NAME.CART));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ReshapeDataInteceptor());

  app.use(cookieParser());

  await app.startAllMicroservices();
  await app.listen(env.SERVICE_PORT);
  logger.log(`Cart service is listening on port ${env.SERVICE_PORT}`);
}
bootstrap();
