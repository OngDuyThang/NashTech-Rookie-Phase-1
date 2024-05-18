import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { Env } from '@app/env';
import { NODE_ENV } from '@app/common';

@Module({})
export class GraphQLModule {
  static forRoot(
    schemaPath: string
  ): DynamicModule {
    return {
      module: GraphQLModule,
      imports: [
        NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
          inject: [Env],
          driver: ApolloDriver,
          useFactory: (env: Env) => ({
            autoSchemaFile: join(process.cwd(), schemaPath),
            sortSchema: true,
            formatError: (formattedError) => {
              const originalError = formattedError.extensions?.originalError as any;

              if (!originalError) {
                return {
                  message: formattedError.message,
                  statusCode: formattedError.extensions?.code,
                };
              }

              const message = originalError?.error || originalError?.message
              const statusCode = originalError?.statusCode
              const detail = originalError?.message
              const stack = formattedError.extensions?.stacktrace

              return {
                message,
                statusCode,
                detail,
                ...(env.NODE_ENV == NODE_ENV.DEVELOPMENT ? { stack } : null)
              };
            },
          })
        }),
      ],
      exports: [NestGraphQLModule]
    }
  }
}
