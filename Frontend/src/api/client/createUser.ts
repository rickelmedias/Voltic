import client from '@/lib/api'
import type { CreateUserMutationRequest, CreateUserMutationResponse } from '../models/CreateUser.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getCreateUserUrl() {
  return `${API_BASE_URL}/users` as const
}

/**
 * @summary Cria um novo usuário
 * {@link /api/v1/users}
 */
export async function createUser(
  data?: CreateUserMutationRequest,
  config: Partial<RequestConfig<CreateUserMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<CreateUserMutationResponse, ResponseErrorConfig<Error>, CreateUserMutationRequest>({
    method: 'POST',
    url: getCreateUserUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}