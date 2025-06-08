import client from '@/lib/api'
import type { GetDevicesQueryResponse, GetDevicesQueryParams } from '../models/GetDevices.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getGetDevicesUrl() {
  return `${API_BASE_URL}/devices` as const
}

/**
 * @summary Lista todos os dispositivos cadastrados
 * {@link /api/v1/devices}
 */
export async function getDevices(params?: GetDevicesQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetDevicesQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetDevicesUrl().toString(),
    params,
    ...requestConfig,
  })
  return res.data
}