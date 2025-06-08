import client from '@kubb/plugin-client/clients/axios'
import type { GetMeQueryResponse } from '../models/GetMe.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getMe } from '../client/getMe.ts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getMeSuspenseQueryKey = () => [{ url: '/api/v1/users/me' }] as const

export type GetMeSuspenseQueryKey = ReturnType<typeof getMeSuspenseQueryKey>

export function getMeSuspenseQueryOptions(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getMeSuspenseQueryKey()
  return queryOptions<GetMeQueryResponse, ResponseErrorConfig<Error>, GetMeQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getMe(config)
    },
  })
}

/**
 * @summary Retorna dados do usuário autenticado
 * {@link /api/v1/users/me}
 */
export function useGetMeSuspense<TData = GetMeQueryResponse, TQueryData = GetMeQueryResponse, TQueryKey extends QueryKey = GetMeSuspenseQueryKey>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetMeQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getMeSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(getMeSuspenseQueryOptions(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}