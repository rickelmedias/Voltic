import client from '@kubb/plugin-client/clients/axios'
import type { GetMeasurementsQueryResponse, GetMeasurementsQueryParams } from '../models/GetMeasurements.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { getMeasurements } from '../client/getMeasurements.ts'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getMeasurementsSuspenseQueryKey = (params: GetMeasurementsQueryParams) => [{ url: '/api/v1/measurements' }, ...(params ? [params] : [])] as const

export type GetMeasurementsSuspenseQueryKey = ReturnType<typeof getMeasurementsSuspenseQueryKey>

export function getMeasurementsSuspenseQueryOptions(params: GetMeasurementsQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const queryKey = getMeasurementsSuspenseQueryKey(params)
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
export function useGetMeasurementsSuspense<
  TData = GetMeasurementsQueryResponse,
  TQueryData = GetMeasurementsQueryResponse,
  TQueryKey extends QueryKey = GetMeasurementsSuspenseQueryKey,
>(
  params: GetMeasurementsQueryParams,
  options: {
    query?: Partial<UseSuspenseQueryOptions<GetMeasurementsQueryResponse, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getMeasurementsSuspenseQueryKey(params)

  const query = useSuspenseQuery({
    ...(getMeasurementsSuspenseQueryOptions(params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}