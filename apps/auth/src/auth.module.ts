import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@app/database';
import { dataSourceOptions } from '../database/data-source';
import { ConfigModule } from '@nestjs/config';
import { Env, EnvModule } from '@app/env';
import { getEnvFilePath } from '@app/common';
import { UserEntity } from './entities/user.entity';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule.forRoot(dataSourceOptions),
    EnvModule.forRoot(getEnvFilePath('auth')),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
