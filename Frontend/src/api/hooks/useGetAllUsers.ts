import client from '@kubb/plugin-client/clients/axios'
import type { GetAllUsersQueryResponse, GetAllUsersQueryParams } from '../models/GetAllUsers.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getAllUsers } from '../client/getAllUsers.ts'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getAllUsersQueryKey = (params: GetAllUsersQueryParams) => [{ url: '/api/v1/users' }, ...(params ? [params] : [])] as const

export type GetAllUsersQueryKey = ReturnType<typeof getAllUsersQueryKey>

export function getAllUsersQueryOptions(params: GetAllUsersQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getAllUsersQueryKey(params)
  return queryOptions<GetAllUsersQueryResponse, ResponseErrorConfig<Error>, GetAllUsersQueryResponse, typeof queryKey>({
    enabled: !!params,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getAllUsers(params, config)
    },
  })
}

/**
 * @summary Lista todos os usuários (Admin)
 * {@link /api/v1/users}
 */
export function useGetAllUsers<TData = GetAllUsersQueryResponse, TQueryData = GetAllUsersQueryResponse, TQueryKey extends QueryKey = GetAllUsersQueryKey>(
  params: GetAllUsersQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetAllUsersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getAllUsersQueryKey(params)

  const query = useQuery({
    ...(getAllUsersQueryOptions(params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}