import client from '@/lib/api'
import type { CreateMeasurementMutationRequest, CreateMeasurementMutationResponse } from '../models/CreateMeasurement.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getCreateMeasurementUrl() {
  return `${API_BASE_URL}/measurements` as const
}

/**
 * @summary Registra uma medição elétrica individual
 * {@link /api/v1/measurements}
 */
export async function createMeasurement(
  data: CreateMeasurementMutationRequest,
  config: Partial<RequestConfig<CreateMeasurementMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<CreateMeasurementMutationResponse, ResponseErrorConfig<Error>, CreateMeasurementMutationRequest>({
    method: 'POST',
    url: getCreateMeasurementUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}