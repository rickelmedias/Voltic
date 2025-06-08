import client from '@/lib/api'
import type { GetDevicesByUserQueryResponse, GetDevicesByUserQueryParams } from '../models/GetDevicesByUser.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getGetDevicesByUserUrl() {
  return `${API_BASE_URL}/devices/byUser` as const
}

/**
 * @summary Lista dispositivos do usuário autenticado
 * {@link /api/v1/devices/byUser}
 */
export async function getDevicesByUser(params?: GetDevicesByUserQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetDevicesByUserQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetDevicesByUserUrl().toString(),
    params,
    ...requestConfig,
  })
  return res.data
}