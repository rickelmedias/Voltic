import client from '@/lib/api'
import type { GetDeviceByIdQueryResponse, GetDeviceByIdPathParams } from '../models/GetDeviceById.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getGetDeviceByIdUrl(deviceId: GetDeviceByIdPathParams['deviceId']) {
  return `${API_BASE_URL}/devices/${deviceId}` as const
}

/**
 * @summary Busca um dispositivo pelo seu ID único
 * {@link /api/v1/devices/:deviceId}
 */
export async function getDeviceById(deviceId: GetDeviceByIdPathParams['deviceId'], config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetDeviceByIdQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetDeviceByIdUrl(deviceId).toString(),
    ...requestConfig,
  })
  return res.data
}