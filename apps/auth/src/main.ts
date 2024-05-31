import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { QUEUE_NAME, ReshapeDataInteceptor } from '@app/common';
import { RmqService } from '@app/rmq';
import { Env } from '@app/env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule);
  const logger = app.get(Logger);
  const env = app.get(Env)
  const rmqService = app.get(RmqService);

  app.connectMicroservice(
    rmqService.getMicroserviceOptions(
      QUEUE_NAME.AUTH
    )
  )

  app.enableCors({
    origin: true,
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  app.useGlobalInterceptors(new ReshapeDataInteceptor())

  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '/auth/views'));
  app.setViewEngine('hbs');

  await app.startAllMicroservices()
  await app.listen(env.SERVICE_PORT);
  logger.log(`Auth server is listening on port ${env.SERVICE_PORT}`);
}
bootstrap();
