import client from '@kubb/plugin-client/clients/axios'
import type { CreateDeviceMutationRequest, CreateDeviceMutationResponse } from '../models/CreateDevice.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { UseMutationOptions } from '@tanstack/react-query'
import { createDevice } from '../client/createDevice.ts'
import { useMutation } from '@tanstack/react-query'

export const createDeviceMutationKey = () => [{ url: '/api/v1/devices' }] as const

export type CreateDeviceMutationKey = ReturnType<typeof createDeviceMutationKey>

/**
 * @summary Cadastra um novo dispositivo físico
 * {@link /api/v1/devices}
 */
export function useCreateDevice<TContext>(
  options: {
    mutation?: UseMutationOptions<CreateDeviceMutationResponse, ResponseErrorConfig<Error>, { data: CreateDeviceMutationRequest }, TContext>
    client?: Partial<RequestConfig<CreateDeviceMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createDeviceMutationKey()

  return useMutation<CreateDeviceMutationResponse, ResponseErrorConfig<Error>, { data: CreateDeviceMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return createDevice(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}