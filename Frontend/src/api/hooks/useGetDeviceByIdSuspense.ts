import client from '@kubb/plugin-client/clients/axios'
import type { GetDeviceByIdQueryResponse, GetDeviceByIdPathParams } from '../models/GetDeviceById.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getDeviceById } from '../client/getDeviceById.ts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getDeviceByIdSuspenseQueryKey = (deviceId: GetDeviceByIdPathParams['deviceId']) =>
  [{ url: '/api/v1/devices/:deviceId', params: { deviceId: deviceId } }] as const

export type GetDeviceByIdSuspenseQueryKey = ReturnType<typeof getDeviceByIdSuspenseQueryKey>

export function getDeviceByIdSuspenseQueryOptions(
  deviceId: GetDeviceByIdPathParams['deviceId'],
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getDeviceByIdSuspenseQueryKey(deviceId)
  return queryOptions<GetDeviceByIdQueryResponse, ResponseErrorConfig<Error>, GetDeviceByIdQueryResponse, typeof queryKey>({
    enabled: !!deviceId,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDeviceById(deviceId, config)
    },
  })
}

/**
 * @summary Busca um dispositivo pelo seu ID único
 * {@link /api/v1/devices/:deviceId}
 */
export function useGetDeviceByIdSuspense<
  TData = GetDeviceByIdQueryResponse,
  TQueryData = GetDeviceByIdQueryResponse,
  TQueryKey extends QueryKey = GetDeviceByIdSuspenseQueryKey,
>(
  deviceId: GetDeviceByIdPathParams['deviceId'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetDeviceByIdQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeviceByIdSuspenseQueryKey(deviceId)

  const query = useSuspenseQuery({
    ...(getDeviceByIdSuspenseQueryOptions(deviceId, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}