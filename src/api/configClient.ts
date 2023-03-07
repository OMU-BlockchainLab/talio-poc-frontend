import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  makeOperation,
} from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';

const client = createClient({
  url: process.env.REACT_APP_API_URL || '',
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      getAuth: async ({ authState, mutate }: any) => {
        // for initial launch, fetch the auth state from storage (local storage, async storage etc)
        const token = localStorage.getItem('token');
        if (!authState) {
          if (token) {
            return { token };
          }
          return null;
        }
        return null;
      },
      addAuthToOperation: ({ authState, operation }: any) => {
        // the token isn't in the auth state, return the operation without changes

        if (!authState || !authState.token) {
          return operation;
        }

        // fetchOptions can be a function (See Client API) but you can simplify this based on usage
        const fetchOptions =
          typeof operation.context.fetchOptions === 'function'
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {};

        return makeOperation(operation.kind, operation, {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              authorization: `${localStorage.getItem('token')}`,
            },
          },
        });
      },
      didAuthError: ({ error }: any) => {
        return error.graphQLErrors.some((e: any) => e.response.status === 401);
      },
    }),
    multipartFetchExchange,
    fetchExchange,
  ],
});

export default client;
