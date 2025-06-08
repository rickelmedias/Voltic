import client from '@kubb/plugin-client/clients/axios'
import type { ActivateDeviceMutationRequest, ActivateDeviceMutationResponse } from '../models/ActivateDevice.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { UseMutationOptions } from '@tanstack/react-query'
import { activateDevice } from '../client/activateDevice.ts'
import { useMutation } from '@tanstack/react-query'

export const activateDeviceMutationKey = () => [{ url: '/api/v1/devices/activate' }] as const

export type ActivateDeviceMutationKey = ReturnType<typeof activateDeviceMutationKey>

/**
 * @summary Ativa e associa um dispositivo pelo código
 * {@link /api/v1/devices/activate}
 */
export function useActivateDevice<TContext>(
  options: {
    mutation?: UseMutationOptions<ActivateDeviceMutationResponse, ResponseErrorConfig<Error>, { data: ActivateDeviceMutationRequest }, TContext>
    client?: Partial<RequestConfig<ActivateDeviceMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? activateDeviceMutationKey()

  return useMutation<ActivateDeviceMutationResponse, ResponseErrorConfig<Error>, { data: ActivateDeviceMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return activateDevice(data, config as any)
    },
    mutationKey,
    ...mutationOptions,
  })
}