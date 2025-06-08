import client from '@kubb/plugin-client/clients/axios'
import type { GetDevicesByUserQueryResponse, GetDevicesByUserQueryParams } from '../models/GetDevicesByUser.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getDevicesByUser } from '../client/getDevicesByUser.ts'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getDevicesByUserQueryKey = (params?: GetDevicesByUserQueryParams) => [{ url: '/api/v1/devices/byUser' }, ...(params ? [params] : [])] as const

export type GetDevicesByUserQueryKey = ReturnType<typeof getDevicesByUserQueryKey>

export function getDevicesByUserQueryOptions(params?: GetDevicesByUserQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getDevicesByUserQueryKey(params)
  return queryOptions<GetDevicesByUserQueryResponse, ResponseErrorConfig<Error>, GetDevicesByUserQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDevicesByUser(params, config)
    },
  })
}

/**
 * @summary Lista dispositivos do usuário autenticado
 * {@link /api/v1/devices/byUser}
 */
export function useGetDevicesByUser<
  TData = GetDevicesByUserQueryResponse,
  TQueryData = GetDevicesByUserQueryResponse,
  TQueryKey extends QueryKey = GetDevicesByUserQueryKey,
>(
  params?: GetDevicesByUserQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetDevicesByUserQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDevicesByUserQueryKey(params)

  const query = useQuery({
    ...(getDevicesByUserQueryOptions(params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}