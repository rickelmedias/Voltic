/**
 * @description DTO de resposta para uma medição.
 */
export type MeasurementResponseDTO = {
  /**
   * @description ID interno da medição.
   * @type string | undefined
   */
  id?: string
  /**
   * @description Identificador do dispositivo dessa medição.
   * @type string | undefined
   */
  deviceId?: string
  /**
   * @description Timestamp da medição.
   * @type string | undefined, date-time
   */
  timestamp?: string
  /**
   * @description Corrente RMS medida.
   * @type number | undefined, double
   */
  correnteRms?: number
  /**
   * @description Tensão RMS medida.
   * @type number | undefined, double
   */
  tensaoRms?: number
}