import client from '@kubb/plugin-client/clients/axios'
import type { GetDevicesQueryResponse, GetDevicesQueryParams } from '../models/GetDevices.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getDevices } from '../client/getDevices.ts'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getDevicesQueryKey = (params?: GetDevicesQueryParams) => [{ url: '/api/v1/devices' }, ...(params ? [params] : [])] as const

export type GetDevicesQueryKey = ReturnType<typeof getDevicesQueryKey>

export function getDevicesQueryOptions(params?: GetDevicesQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getDevicesQueryKey(params)
  return queryOptions<GetDevicesQueryResponse, ResponseErrorConfig<Error>, GetDevicesQueryResponse, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDevices(params, config)
    },
  })
}

/**
 * @summary Lista todos os dispositivos cadastrados
 * {@link /api/v1/devices}
 */
export function useGetDevices<TData = GetDevicesQueryResponse, TQueryData = GetDevicesQueryResponse, TQueryKey extends QueryKey = GetDevicesQueryKey>(
  params?: GetDevicesQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetDevicesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDevicesQueryKey(params)

  const query = useQuery({
    ...(getDevicesQueryOptions(params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}