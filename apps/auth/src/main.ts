import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const logger = app.get(Logger);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  app.use(cookieParser());

  await app.listen(3000);
  logger.log(`App is listening on port 3000`);
}
bootstrap();
