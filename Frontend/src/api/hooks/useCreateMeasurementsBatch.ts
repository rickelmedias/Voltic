import client from '@kubb/plugin-client/clients/axios'
import type { CreateMeasurementsBatchMutationRequest, CreateMeasurementsBatchMutationResponse } from '../models/CreateMeasurementsBatch.ts'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'
import type { UseMutationOptions } from '@tanstack/react-query'
import { createMeasurementsBatch } from '../client/createMeasurementsBatch.ts'
import { useMutation } from '@tanstack/react-query'

export const createMeasurementsBatchMutationKey = () => [{ url: '/api/v1/measurements/batch' }] as const

export type CreateMeasurementsBatchMutationKey = ReturnType<typeof createMeasurementsBatchMutationKey>

/**
 * @summary Registra um lote de medições elétricas
 * {@link /api/v1/measurements/batch}
 */
export function useCreateMeasurementsBatch<TContext>(
  options: {
    mutation?: UseMutationOptions<
      CreateMeasurementsBatchMutationResponse,
      ResponseErrorConfig<Error>,
      { data: CreateMeasurementsBatchMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<CreateMeasurementsBatchMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createMeasurementsBatchMutationKey()

  return useMutation<CreateMeasurementsBatchMutationResponse, ResponseErrorConfig<Error>, { data: CreateMeasurementsBatchMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return createMeasurementsBatch(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}