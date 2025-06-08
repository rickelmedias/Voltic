import type { DeviceActivationRequestDTO } from './DeviceActivationRequestDTO.ts'
import type { DeviceActivationResponseDTO } from './DeviceActivationResponseDTO.ts'

/**
 * @description OK
 */
export type ActivateDevice200 = DeviceActivationResponseDTO

export type ActivateDeviceMutationRequest = DeviceActivationRequestDTO

export type ActivateDeviceMutationResponse = ActivateDevice200

export type ActivateDeviceMutation = {
  Response: ActivateDevice200
  Request: ActivateDeviceMutationRequest
  Errors: any
}