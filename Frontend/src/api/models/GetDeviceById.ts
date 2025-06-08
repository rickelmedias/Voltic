import type { DeviceResponseDTO } from './DeviceResponseDTO.ts'

export type GetDeviceByIdPathParams = {
  /**
   * @type string
   */
  deviceId: string
}

/**
 * @description OK
 */
export type GetDeviceById200 = DeviceResponseDTO

export type GetDeviceByIdQueryResponse = GetDeviceById200

export type GetDeviceByIdQuery = {
  Response: GetDeviceById200
  PathParams: GetDeviceByIdPathParams
  Errors: any
}