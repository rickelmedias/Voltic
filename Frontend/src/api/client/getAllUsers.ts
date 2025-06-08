import client from '@/lib/api'
import type { GetAllUsersQueryResponse, GetAllUsersQueryParams } from '../models/GetAllUsers.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getGetAllUsersUrl() {
  return `${API_BASE_URL}/users` as const
}

/**
 * @summary Lista todos os usuários (Admin)
 * {@link /api/v1/users}
 */
export async function getAllUsers(params: GetAllUsersQueryParams, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetAllUsersQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetAllUsersUrl().toString(),
    params,
    ...requestConfig,
  })
  return res.data
}