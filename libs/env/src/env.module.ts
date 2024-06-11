import { DynamicModule, Global, Module } from '@nestjs/common';
import { Env } from './env.service';
import { ConfigModule } from '@nestjs/config';
import { classValidate } from '@app/common';
import { ClassConstructor } from 'class-transformer';
import { AbstractEnvValidation } from './env.validation';

@Global()
@Module({})
export class EnvModule {
  static forRoot(
    path: string,
    validationClass: ClassConstructor<AbstractEnvValidation>,
  ): DynamicModule {
    return {
      module: EnvModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: path,
          validate: (config: Record<string, unknown>) => {
            return classValidate(validationClass, config, true);
          },
          isGlobal: true,
        }),
      ],
      providers: [Env],
      exports: [Env],
    };
  }
}
