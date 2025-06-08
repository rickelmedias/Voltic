/**
 * @description Dados retornados de um dispositivo.
 */
export type DeviceResponseDTO = {
  /**
   * @description Identificador do dispositivo no banco
   * @type string | undefined
   */
  id?: string
  /**
   * @type string | undefined
   */
  deviceId?: string
  /**
   * @type string | undefined
   */
  name?: string
  /**
   * @type string | undefined
   */
  description?: string
  /**
   * @type string | undefined
   */
  activationCode?: string
  /**
   * @type boolean | undefined
   */
  activated?: boolean
}