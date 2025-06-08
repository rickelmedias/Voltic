import client from '@/lib/api'
import type { CreateDeviceMutationRequest, CreateDeviceMutationResponse } from '../models/CreateDevice.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getCreateDeviceUrl() {
  return `${API_BASE_URL}/devices` as const
}

/**
 * @summary Cadastra um novo dispositivo físico
 * {@link /api/v1/devices}
 */
export async function createDevice(
  data: CreateDeviceMutationRequest,
  config: Partial<RequestConfig<CreateDeviceMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<CreateDeviceMutationResponse, ResponseErrorConfig<Error>, CreateDeviceMutationRequest>({
    method: 'POST',
    url: getCreateDeviceUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}