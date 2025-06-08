import client from '@kubb/plugin-client/clients/axios'
import type { GetMeasurementsQueryResponse, GetMeasurementsQueryParams } from '../models/GetMeasurements.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { getMeasurements } from '../client/getMeasurements.ts'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getMeasurementsQueryKey = (params: GetMeasurementsQueryParams) => [{ url: '/api/v1/measurements' }, ...(params ? [params] : [])] as const

export type GetMeasurementsQueryKey = ReturnType<typeof getMeasurementsQueryKey>

export function getMeasurementsQueryOptions(params: GetMeasurementsQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getMeasurementsQueryKey(params)
  return queryOptions<GetMeasurementsQueryResponse, ResponseErrorConfig<Error>, GetMeasurementsQueryResponse, typeof queryKey>({
    enabled: !!params,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getMeasurements(params, config)
    },
  })
}

/**
 * @summary Lista medições de um dispositivo (paginado)
 * {@link /api/v1/measurements}
 */
export function useGetMeasurements<
  TData = GetMeasurementsQueryResponse,
  TQueryData = GetMeasurementsQueryResponse,
  TQueryKey extends QueryKey = GetMeasurementsQueryKey,
>(
  params: GetMeasurementsQueryParams,
  options: {
    query?: Partial<QueryObserverOptions<GetMeasurementsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getMeasurementsQueryKey(params)

  const query = useQuery({
    ...(getMeasurementsQueryOptions(params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}