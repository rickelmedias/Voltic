/**
 * @description DTO para criação de uma medição individual.
 */
export type MeasurementDTO = {
  /**
   * @description Identificador único do dispositivo.
   * @minLength 1
   * @type string
   */
  deviceId: string
  /**
   * @description Timestamp da medição em formato ISO-8601.
   * @type string, date-time
   */
  timestamp: string
  /**
   * @description Valor de corrente RMS (Ampère).
   * @type number, double
   */
  correnteRms: number
  /**
   * @description Valor de tensão RMS (Volts).
   * @type number, double
   */
  tensaoRms: number
}