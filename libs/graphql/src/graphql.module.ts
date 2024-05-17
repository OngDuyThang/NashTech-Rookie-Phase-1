import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({})
export class GraphQLModule {
  static forRoot(
    schemaPath: string
  ): DynamicModule {
    return {
      module: GraphQLModule,
      imports: [
        NestGraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), schemaPath),
          sortSchema: true,
        }),
      ],
      exports: [NestGraphQLModule]
    }
  }
}
