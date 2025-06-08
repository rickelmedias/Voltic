import client from '@kubb/plugin-client/clients/axios'
import type { GetAllUsersQueryResponse, GetAllUsersQueryParams } from '../models/GetAllUsers.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getAllUsers } from '../client/getAllUsers.ts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getAllUsersSuspenseQueryKey = (params: GetAllUsersQueryParams) => [{ url: '/api/v1/users' }, ...(params ? [params] : [])] as const

export type GetAllUsersSuspenseQueryKey = ReturnType<typeof getAllUsersSuspenseQueryKey>

export function getAllUsersSuspenseQueryOptions(params: GetAllUsersQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getAllUsersSuspenseQueryKey(params)
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
export function useGetAllUsersSuspense<
  TData = GetAllUsersQueryResponse,
  TQueryData = GetAllUsersQueryResponse,
  TQueryKey extends QueryKey = GetAllUsersSuspenseQueryKey,
>(
  params: GetAllUsersQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetAllUsersQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getAllUsersSuspenseQueryKey(params)

  const query = useSuspenseQuery({
    ...(getAllUsersSuspenseQueryOptions(params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}