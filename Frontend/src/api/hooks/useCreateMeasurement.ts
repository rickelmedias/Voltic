import client from '@kubb/plugin-client/clients/axios'
import type { CreateMeasurementMutationRequest, CreateMeasurementMutationResponse } from '../models/CreateMeasurement.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { UseMutationOptions } from '@tanstack/react-query'
import { createMeasurement } from '../client/createMeasurement.ts'
import { useMutation } from '@tanstack/react-query'

export const createMeasurementMutationKey = () => [{ url: '/api/v1/measurements' }] as const

export type CreateMeasurementMutationKey = ReturnType<typeof createMeasurementMutationKey>

/**
 * @summary Registra uma medição elétrica individual
 * {@link /api/v1/measurements}
 */
export function useCreateMeasurement<TContext>(
  options: {
    mutation?: UseMutationOptions<CreateMeasurementMutationResponse, ResponseErrorConfig<Error>, { data: CreateMeasurementMutationRequest }, TContext>
    client?: Partial<RequestConfig<CreateMeasurementMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createMeasurementMutationKey()

  return useMutation<CreateMeasurementMutationResponse, ResponseErrorConfig<Error>, { data: CreateMeasurementMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return createMeasurement(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}