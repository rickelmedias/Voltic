import client from '@/lib/api'
import type { LoginMutationRequest, LoginMutationResponse } from '../models/Login.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/api'
import { API_BASE_URL } from '@/config/api.ts'

export function getLoginUrl() {
  return `${API_BASE_URL}/auth/login` as const
}

/**
 * @summary Autentica usuário e retorna token JWT
 * {@link /api/v1/auth/login}
 */
export async function login(data?: LoginMutationRequest, config: Partial<RequestConfig<LoginMutationRequest>> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<LoginMutationResponse, ResponseErrorConfig<Error>, LoginMutationRequest>({
    method: 'POST',
    url: getLoginUrl().toString(),
    data,
    ...requestConfig,
  })
  return res.data
}