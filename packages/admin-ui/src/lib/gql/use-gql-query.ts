import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  type UndefinedInitialDataOptions,
  useQuery,
  type UseQueryResult
} from '@tanstack/react-query';

import { type GraphqlError } from '../errors';
import { gqlFetcher } from './gql-fetcher';

/**
 * A wrapper around react-query's `useQuery` that uses graphql-request to fetch admin api.
 */
export const useGqlQuery = <R, V>(
  options: UseGqlQueryOptions<R, V>
): UseQueryResult<R, GraphqlError> => {
  return useQuery({
    ...options,
    queryKey: options.key ?? [],
    queryFn: async () => await gqlFetcher(options.document, options.variables)
  });
};

type UseGqlQueryOptions<R, V> = {
  document: TypedDocumentNode<R, V>;
  key?: string[];
  variables?: V;
} & Omit<UndefinedInitialDataOptions<R, GraphqlError, R, string[]>, 'queryKey' | 'queryFn'>;
