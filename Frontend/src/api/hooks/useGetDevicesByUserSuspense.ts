import client from '@kubb/plugin-client/clients/axios'
import type { GetDevicesByUserQueryResponse, GetDevicesByUserQueryParams } from '../models/GetDevicesByUser.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getDevicesByUser } from '../client/getDevicesByUser.ts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getDevicesByUserSuspenseQueryKey = (params?: GetDevicesByUserQueryParams) =>
  [{ url: '/api/v1/devices/byUser' }, ...(params ? [params] : [])] as const

export type GetDevicesByUserSuspenseQueryKey = ReturnType<typeof getDevicesByUserSuspenseQueryKey>

export function getDevicesByUserSuspenseQueryOptions(params?: GetDevicesByUserQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getDevicesByUserSuspenseQueryKey(params)
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
export function useGetDevicesByUserSuspense<
  TData = GetDevicesByUserQueryResponse,
  TQueryData = GetDevicesByUserQueryResponse,
  TQueryKey extends QueryKey = GetDevicesByUserSuspenseQueryKey,
>(
  params?: GetDevicesByUserQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetDevicesByUserQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDevicesByUserSuspenseQueryKey(params)

  const query = useSuspenseQuery({
    ...(getDevicesByUserSuspenseQueryOptions(params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}