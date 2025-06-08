import type { MeasurementBatchDTO } from './MeasurementBatchDTO.ts'

/**
 * @description Accepted
 */
export type CreateMeasurementsBatch202 = any

export type CreateMeasurementsBatchMutationRequest = MeasurementBatchDTO

export type CreateMeasurementsBatchMutationResponse = CreateMeasurementsBatch202

export type CreateMeasurementsBatchMutation = {
  Response: CreateMeasurementsBatch202
  Request: CreateMeasurementsBatchMutationRequest
  Errors: any
}