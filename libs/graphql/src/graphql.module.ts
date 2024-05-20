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
            cors: {
              origin: true,
              credentials: true
            },
            playground: {
              settings: {
                "request.credentials": "include"
              }
            },
            // { req, res } are request and response object from express,
            // return graphql context object
            context: ({ req, res }) => {
              req.user = {}
              return { req, res }
            },
            formatError: (formattedError) => {
              const originalError = formattedError.extensions?.originalError as any;

              if (!originalError) {
                const stack = formattedError.extensions?.stacktrace
                return {
                  message: formattedError.message,
                  statusCode: formattedError.extensions?.code,
                  ...(env.NODE_ENV == NODE_ENV.DEVELOPMENT ? { stack } : null)
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
            }
          })
        }),
      ],
      exports: [NestGraphQLModule]
    }
  }
}
