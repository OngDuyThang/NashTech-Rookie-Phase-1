import { NestFactory } from '@nestjs/core';
import { AssetModule } from './asset.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Env } from '@app/env';
import { ReshapeDataInteceptor } from '@app/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AssetModule);
  const logger = app.get(Logger);
  const env = app.get(Env)

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

  await app.listen(env.SERVICE_PORT);
  logger.log(`Asset service is listening on port ${env.SERVICE_PORT}`);
}
bootstrap();
