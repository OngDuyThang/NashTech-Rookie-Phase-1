import { DynamicModule, Global, Module } from '@nestjs/common';
import { Env } from './env.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validateEnv from './env.validation';

@Global()
@Module({})
export class EnvModule {
  static forRoot(
    path: string
  ): DynamicModule {
    return {
      module: EnvModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: path,
          validate: validateEnv
        })
      ],
      providers: [Env],
      exports: [Env]
    }
  }
}

