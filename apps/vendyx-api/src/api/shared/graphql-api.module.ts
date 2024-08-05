import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

import { DateScalar, IDScalar } from './scalars';

/**
 * Module to create a GraphQL API used for /admin-api and /storefront-api
 */
@Module({
  providers: [IDScalar, DateScalar]
})
export class GraphqlApiModule {
  static register(options: GraphqlApiModuleOptions): DynamicModule {
    return {
      imports: options.include,
      ...GraphQLModule.forRoot<ApolloDriverConfig>({
        // false to use apollo studio
        playground: false,
        resolvers: { JSON: GraphQLJSON },
        // TODO: false in production, true in dev
        includeStacktraceInErrorResponses: false,
        // Always true because the graphql playground must be public
        introspection: true,
        driver: ApolloDriver,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        path: options.path,
        typePaths: options.typePaths,
        include: options.include,
        // Al unhandled http error comes here
        formatError: error => {
          const originalError = error.extensions?.originalError as OriginalError;

          // Http exception throw by nestjs
          if (!originalError) {
            return {
              message: error.message,
              code: error.extensions?.code
            };
          }

          // Http exception throw by us
          return {
            message: originalError.message,
            code: originalError.statusCode
          };
        }
      })
    };
  }
}

type GraphqlApiModuleOptions = {
  include: any[];
  typePaths: string[];
  path: string;
};

type OriginalError = {
  statusCode: number;
  message: string;
  error: string;
};