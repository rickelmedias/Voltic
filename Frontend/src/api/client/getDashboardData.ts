import client from '@/lib/api'
import type { GetDashboardDataQueryResponse, GetDashboardDataPathParams, GetDashboardDataQueryParams } from '../models/GetDashboardData.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getGetDashboardDataUrl(deviceId: GetDashboardDataPathParams['deviceId']) {
  return `${API_BASE_URL}/devices/${deviceId}/dashboard` as const
}

/**
 * @summary Retorna dados de gráfico para o dashboard
 * {@link /api/v1/devices/:deviceId/dashboard}
 */
export async function getDashboardData(
  deviceId: GetDashboardDataPathParams['deviceId'],
  params?: GetDashboardDataQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetDashboardDataQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetDashboardDataUrl(deviceId).toString(),
    params,
    ...requestConfig,
  })
  return res.data
}