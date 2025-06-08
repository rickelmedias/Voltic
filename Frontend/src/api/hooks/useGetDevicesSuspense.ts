import client from '@kubb/plugin-client/clients/axios'
import type { GetDevicesQueryResponse, GetDevicesQueryParams } from '../models/GetDevices.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getDevices } from '../client/getDevices.ts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getDevicesSuspenseQueryKey = (params?: GetDevicesQueryParams) => [{ url: '/api/v1/devices' }, ...(params ? [params] : [])] as const

export type GetDevicesSuspenseQueryKey = ReturnType<typeof getDevicesSuspenseQueryKey>

export function getDevicesSuspenseQueryOptions(params?: GetDevicesQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getDevicesSuspenseQueryKey(params)
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
export function useGetDevicesSuspense<
  TData = GetDevicesQueryResponse,
  TQueryData = GetDevicesQueryResponse,
  TQueryKey extends QueryKey = GetDevicesSuspenseQueryKey,
>(
  params?: GetDevicesQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetDevicesQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDevicesSuspenseQueryKey(params)

  const query = useSuspenseQuery({
    ...(getDevicesSuspenseQueryOptions(params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}