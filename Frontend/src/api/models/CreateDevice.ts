import type { DeviceDTO } from './DeviceDTO.ts'
import type { DeviceResponseDTO } from './DeviceResponseDTO.ts'

/**
 * @description Created
 */
export type CreateDevice201 = DeviceResponseDTO

export type CreateDeviceMutationRequest = DeviceDTO

export type CreateDeviceMutationResponse = CreateDevice201

export type CreateDeviceMutation = {
  Response: CreateDevice201
  Request: CreateDeviceMutationRequest
  Errors: any
}