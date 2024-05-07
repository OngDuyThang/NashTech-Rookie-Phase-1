import { Logger, Module, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from '../database/data-source';
import { EnvModule } from '@app/env';
import { HttpExceptionFilter, TypeORMExceptionFilter, getEnvFilePath } from '@app/common';
import { UserModule } from './modules/user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { TokenModule } from './modules/token/token.module';
import { AccessTokenStrategy, LocalAuthStrategy } from './common/strategies';
import { EnvValidation } from './env.validation';
import { MailerModule } from '@app/mailer';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  },
  {
    provide: APP_FILTER,
    useClass: TypeORMExceptionFilter
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
    MailerModule.forRoot()
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Logger,
    LocalAuthStrategy,
    AccessTokenStrategy,
    ...providers
  ],
})
export class AuthModule {}
