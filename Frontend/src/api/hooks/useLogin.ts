import client from '@kubb/plugin-client/clients/axios'
import type { LoginMutationRequest, LoginMutationResponse } from '../models/Login.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { UseMutationOptions } from '@tanstack/react-query'
import { login } from '../client/login.ts'
import { useMutation } from '@tanstack/react-query'

export const loginMutationKey = () => [{ url: '/api/v1/auth/login' }] as const

export type LoginMutationKey = ReturnType<typeof loginMutationKey>

/**
 * @summary Autentica usuário e retorna token JWT
 * {@link /api/v1/auth/login}
 */
export function useLogin<TContext>(
  options: {
    mutation?: UseMutationOptions<LoginMutationResponse, ResponseErrorConfig<Error>, { data?: LoginMutationRequest }, TContext>
    client?: Partial<RequestConfig<LoginMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? loginMutationKey()

  return useMutation<LoginMutationResponse, ResponseErrorConfig<Error>, { data?: LoginMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return login(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}