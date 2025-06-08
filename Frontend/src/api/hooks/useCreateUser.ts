import client from '@kubb/plugin-client/clients/axios'
import type { CreateUserMutationRequest, CreateUserMutationResponse } from '../models/CreateUser.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { UseMutationOptions } from '@tanstack/react-query'
import { createUser } from '../client/createUser.ts'
import { useMutation } from '@tanstack/react-query'

export const createUserMutationKey = () => [{ url: '/api/v1/users' }] as const

export type CreateUserMutationKey = ReturnType<typeof createUserMutationKey>

/**
 * @summary Cria um novo usuário
 * {@link /api/v1/users}
 */
export function useCreateUser<TContext>(
  options: {
    mutation?: UseMutationOptions<CreateUserMutationResponse, ResponseErrorConfig<Error>, { data?: CreateUserMutationRequest }, TContext>
    client?: Partial<RequestConfig<CreateUserMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createUserMutationKey()

  return useMutation<CreateUserMutationResponse, ResponseErrorConfig<Error>, { data?: CreateUserMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return createUser(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}