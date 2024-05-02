import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from '../database/data-source';
import { ConfigModule } from '@nestjs/config';
import { Env, EnvModule } from '@app/env';
import { HttpExceptionFilter, TypeORMExceptionFilter, getEnvFilePath } from '@app/common';
import { UserEntity } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { LocalAuthStrategy } from './common/strategies/local-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from './modules/token/token.module';

const providers = [
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
    EnvModule.forRoot(getEnvFilePath('auth')),
    UserModule,
    TokenModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Logger,
    LocalAuthStrategy,
    ...providers
  ],
})
export class AuthModule {}
