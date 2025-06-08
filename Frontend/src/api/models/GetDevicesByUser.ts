import type { PageDeviceResponseDTO } from './PageDeviceResponseDTO.ts'

export type GetDevicesByUserQueryParams = {
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
export type GetDevicesByUser200 = PageDeviceResponseDTO

export type GetDevicesByUserQueryResponse = GetDevicesByUser200

export type GetDevicesByUserQuery = {
  Response: GetDevicesByUser200
  QueryParams: GetDevicesByUserQueryParams
  Errors: any
}