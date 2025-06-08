import client from '@/lib/api'
import type { GetMeQueryResponse } from '../models/GetMe.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getGetMeUrl() {
  return `${API_BASE_URL}/users/me` as const
}

/**
 * @summary Retorna dados do usuário autenticado
 * {@link /api/v1/users/me}
 */
export async function getMe(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetMeQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: getGetMeUrl().toString(), ...requestConfig })
  return res.data
}