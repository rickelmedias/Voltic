import type { MeasurementDTO } from './MeasurementDTO.ts'

/**
 * @description DTO para envio de lote de medições.
 */
export type MeasurementBatchDTO = {
  /**
   * @description Lista de medições a serem inseridas.
   * @type array
   */
  measurements: MeasurementDTO[]
}