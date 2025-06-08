import type { MeasurementDTO } from './MeasurementDTO.ts'
import type { MeasurementResponseDTO } from './MeasurementResponseDTO.ts'

/**
 * @description Created
 */
export type CreateMeasurement201 = MeasurementResponseDTO

export type CreateMeasurementMutationRequest = MeasurementDTO

export type CreateMeasurementMutationResponse = CreateMeasurement201

export type CreateMeasurementMutation = {
  Response: CreateMeasurement201
  Request: CreateMeasurementMutationRequest
  Errors: any
}