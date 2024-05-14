import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { QUEUE_NAME, ReshapeDataInteceptor } from '@app/common';
import { RmqService } from '@app/rmq';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule);
  const logger = app.get(Logger);
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
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.startAllMicroservices()
  await app.listen(3000);
  logger.log(`App is listening on port 3000`);
}
bootstrap();
