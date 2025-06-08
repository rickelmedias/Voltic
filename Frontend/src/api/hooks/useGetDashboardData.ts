import client from '@kubb/plugin-client/clients/axios'
import type { GetDashboardDataQueryResponse, GetDashboardDataPathParams, GetDashboardDataQueryParams } from '../models/GetDashboardData.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getDashboardData } from '../client/getDashboardData.ts'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getDashboardDataQueryKey = (deviceId: GetDashboardDataPathParams['deviceId'], params?: GetDashboardDataQueryParams) =>
  [{ url: '/api/v1/devices/:deviceId/dashboard', params: { deviceId: deviceId } }, ...(params ? [params] : [])] as const

export type GetDashboardDataQueryKey = ReturnType<typeof getDashboardDataQueryKey>

export function getDashboardDataQueryOptions(
  deviceId: GetDashboardDataPathParams['deviceId'],
  params?: GetDashboardDataQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDashboardDataQueryKey(deviceId, params)
  return queryOptions<GetDashboardDataQueryResponse, ResponseErrorConfig<Error>, GetDashboardDataQueryResponse, typeof queryKey>({
    enabled: !!deviceId,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDashboardData(deviceId, params, config)
    },
  })
}

/**
 * @summary Retorna dados de gráfico para o dashboard
 * {@link /api/v1/devices/:deviceId/dashboard}
 */
export function useGetDashboardData<
  TData = GetDashboardDataQueryResponse,
  TQueryData = GetDashboardDataQueryResponse,
  TQueryKey extends QueryKey = GetDashboardDataQueryKey,
>(
  deviceId: GetDashboardDataPathParams['deviceId'],
  params?: GetDashboardDataQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetDashboardDataQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDashboardDataQueryKey(deviceId, params)

  const query = useQuery({
    ...(getDashboardDataQueryOptions(deviceId, params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}