import type { PageDeviceResponseDTO } from './PageDeviceResponseDTO.ts'

export type GetDevicesQueryParams = {
  /**
   * @description Número da página (0..N)
   * @default 0
   * @type integer | undefined
   */
  page?: number
  /**
   * @description Tamanho da página
   * @default 20
   * @type integer | undefined
   */
  size?: number
}

/**
 * @description OK
 */
export type GetDevices200 = PageDeviceResponseDTO

export type GetDevicesQueryResponse = GetDevices200

export type GetDevicesQuery = {
  Response: GetDevices200
  QueryParams: GetDevicesQueryParams
  Errors: any
}