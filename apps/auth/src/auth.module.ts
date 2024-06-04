import { Inject, Logger, MiddlewareConsumer, Module, NestModule, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from './database/data-source';
import { EnvModule } from '@app/env';
import { HttpExceptionFilter, LoggerMiddleware, RpcExceptionFilter, TypeORMExceptionFilter, getEnvFilePath } from '@app/common';
import { UserModule } from './modules/user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { TokenModule } from './modules/token';
import { AccessTokenStrategy, GoogleAuthStrategy, LocalAuthStrategy } from './common/strategies';
import { EnvValidation } from './env.validation';
import { MailerModule } from '@app/mailer';
import { CACHE_SERVICE, CacheModule, RedisCache } from '@app/cache';
import { RmqModule } from '@app/rmq';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  },
  {
    provide: APP_FILTER,
    useClass: TypeORMExceptionFilter
  },
  {
    provide: APP_FILTER,
    useClass: RpcExceptionFilter
  }
]

@Module({
  imports: [
    DatabaseModule.forRoot(dataSourceOptions),
    EnvModule.forRoot(
      getEnvFilePath('auth'),
      EnvValidation
    ),
    UserModule,
    TokenModule,
    MailerModule,
    CacheModule.register(30),
    RmqModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Logger,
    LocalAuthStrategy,
    AccessTokenStrategy,
    GoogleAuthStrategy,
    ...providers
  ],
})
export class AuthModule implements NestModule {
  constructor(
    @Inject(CACHE_SERVICE)
    private readonly cacheManager: RedisCache,
    private readonly logger: Logger
  ) {
    const client = this.cacheManager.store.getClient();

    client.on('error', (e) => {
      this.logger.error(e);
    });
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}