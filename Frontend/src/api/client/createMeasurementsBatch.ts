import client from '@/lib/api'
import type { CreateMeasurementsBatchMutationRequest, CreateMeasurementsBatchMutationResponse } from '../models/CreateMeasurementsBatch.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getCreateMeasurementsBatchUrl() {
  return `${API_BASE_URL}/measurements/batch` as const
}

/**
 * @summary Registra um lote de medições elétricas
 * {@link /api/v1/measurements/batch}
 */
export async function createMeasurementsBatch(
  data: CreateMeasurementsBatchMutationRequest,
  config: Partial<RequestConfig<CreateMeasurementsBatchMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<CreateMeasurementsBatchMutationResponse, ResponseErrorConfig<Error>, CreateMeasurementsBatchMutationRequest>({
    method: 'POST',
    url: getCreateMeasurementsBatchUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}