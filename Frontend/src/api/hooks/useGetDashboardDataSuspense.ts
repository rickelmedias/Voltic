import client from '@kubb/plugin-client/clients/axios'
import type { GetDashboardDataQueryResponse, GetDashboardDataPathParams, GetDashboardDataQueryParams } from '../models/GetDashboardData.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getDashboardData } from '../client/getDashboardData.ts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getDashboardDataSuspenseQueryKey = (deviceId: GetDashboardDataPathParams['deviceId'], params?: GetDashboardDataQueryParams) =>
  [{ url: '/api/v1/devices/:deviceId/dashboard', params: { deviceId: deviceId } }, ...(params ? [params] : [])] as const

export type GetDashboardDataSuspenseQueryKey = ReturnType<typeof getDashboardDataSuspenseQueryKey>

export function getDashboardDataSuspenseQueryOptions(
  deviceId: GetDashboardDataPathParams['deviceId'],
  params?: GetDashboardDataQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDashboardDataSuspenseQueryKey(deviceId, params)
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
export function useGetDashboardDataSuspense<
  TData = GetDashboardDataQueryResponse,
  TQueryData = GetDashboardDataQueryResponse,
  TQueryKey extends QueryKey = GetDashboardDataSuspenseQueryKey,
>(
  deviceId: GetDashboardDataPathParams['deviceId'],
  params?: GetDashboardDataQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetDashboardDataQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDashboardDataSuspenseQueryKey(deviceId, params)

  const query = useSuspenseQuery({
    ...(getDashboardDataSuspenseQueryOptions(deviceId, params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}