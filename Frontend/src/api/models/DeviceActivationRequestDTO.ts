/**
 * @description Requisição para ativação de um dispositivo pelo código
 */
export type DeviceActivationRequestDTO = {
  /**
   * @description Código único do dispositivo colado no físico
   * @minLength 1
   * @type string
   */
  activationCode: string
}