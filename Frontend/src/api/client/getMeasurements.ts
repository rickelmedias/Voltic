import client from '@/lib/api'
import type { GetMeasurementsQueryResponse, GetMeasurementsQueryParams } from '../models/GetMeasurements.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getGetMeasurementsUrl() {
  return `${API_BASE_URL}/measurements` as const
}

/**
 * @summary Lista medições de um dispositivo (paginado)
 * {@link /api/v1/measurements}
 */
export async function getMeasurements(params: GetMeasurementsQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetMeasurementsQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetMeasurementsUrl().toString(),
    params,
    ...requestConfig,
  })
  return res.data
}