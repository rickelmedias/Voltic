import type { Pageable } from './Pageable.ts'
import type { PageMeasurementResponseDTO } from './PageMeasurementResponseDTO.ts'

export type GetMeasurementsQueryParams = {
  /**
   * @description ID único do dispositivo
   * @type string
   */
  deviceId: string
  /**
   * @type object
   */
  pageable: Pageable
}

/**
 * @description OK
 */
export type GetMeasurements200 = PageMeasurementResponseDTO

export type GetMeasurementsQueryResponse = GetMeasurements200

export type GetMeasurementsQuery = {
  Response: GetMeasurements200
  QueryParams: GetMeasurementsQueryParams
  Errors: any
}