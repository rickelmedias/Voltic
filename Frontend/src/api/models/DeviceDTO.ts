/**
 * @description Dados para criação de um dispositivo.
 */
export type DeviceDTO = {
  /**
   * @description ID único do dispositivo (ex: ESP32 serial)
   * @minLength 1
   * @type string
   */
  deviceId: string
  /**
   * @description Nome amigável do dispositivo
   * @minLength 1
   * @type string
   */
  name: string
  /**
   * @description Descrição opcional
   * @type string | undefined
   */
  description?: string
}