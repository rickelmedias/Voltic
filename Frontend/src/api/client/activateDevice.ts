import client from '@/lib/api'
import type { ActivateDeviceMutationRequest, ActivateDeviceMutationResponse } from '../models/ActivateDevice.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getActivateDeviceUrl() {
  return `${API_BASE_URL}/devices/activate` as const
}

/**
 * @summary Ativa e associa um dispositivo pelo código
 * {@link /api/v1/devices/activate}
 */
export async function activateDevice(
  data: ActivateDeviceMutationRequest,
  config: Partial<RequestConfig<ActivateDeviceMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<ActivateDeviceMutationResponse, ResponseErrorConfig<Error>, ActivateDeviceMutationRequest>({
    method: 'POST',
    url: getActivateDeviceUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}