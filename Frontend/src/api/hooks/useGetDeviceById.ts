import client from '@kubb/plugin-client/clients/axios'
import type { GetDeviceByIdQueryResponse, GetDeviceByIdPathParams } from '../models/GetDeviceById.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getDeviceById } from '../client/getDeviceById.ts'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getDeviceByIdQueryKey = (deviceId: GetDeviceByIdPathParams['deviceId']) =>
  [{ url: '/api/v1/devices/:deviceId', params: { deviceId: deviceId } }] as const

export type GetDeviceByIdQueryKey = ReturnType<typeof getDeviceByIdQueryKey>

export function getDeviceByIdQueryOptions(deviceId: GetDeviceByIdPathParams['deviceId'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getDeviceByIdQueryKey(deviceId)
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
export function useGetDeviceById<
  TData = GetDeviceByIdQueryResponse,
  TQueryData = GetDeviceByIdQueryResponse,
  TQueryKey extends QueryKey = GetDeviceByIdQueryKey,
>(
  deviceId: GetDeviceByIdPathParams['deviceId'],
  options: {
    query?: Partial<QueryObserverOptions<GetDeviceByIdQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeviceByIdQueryKey(deviceId)

  const query = useQuery({
    ...(getDeviceByIdQueryOptions(deviceId, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}