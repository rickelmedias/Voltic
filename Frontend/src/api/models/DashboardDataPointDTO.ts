/**
 * @description Ponto de dados para gráficos do dashboard.
 */
export type DashboardDataPointDTO = {
  /**
   * @description Momento da medição
   * @type string | undefined, date-time
   */
  timestamp?: string
  /**
   * @description Corrente RMS medida
   * @type number | undefined, double
   */
  currentRms?: number
  /**
   * @description Tensão RMS medida
   * @type number | undefined, double
   */
  voltageRms?: number
  /**
   * @description Consumo estimado (kWh)
   * @type number | undefined, double
   */
  consumption?: number
}