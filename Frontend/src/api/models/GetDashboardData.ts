import type { DashboardDataPointDTO } from './DashboardDataPointDTO.ts'

export type GetDashboardDataPathParams = {
  /**
   * @type string
   */
  deviceId: string
}

export type GetDashboardDataQueryParams = {
  /**
   * @description Período em dias
   * @default 30
   * @type integer | undefined
   */
  days?: number
}

/**
 * @description OK
 */
export type GetDashboardData200 = DashboardDataPointDTO[]

export type GetDashboardDataQueryResponse = GetDashboardData200

export type GetDashboardDataQuery = {
  Response: GetDashboardData200
  PathParams: GetDashboardDataPathParams
  QueryParams: GetDashboardDataQueryParams
  Errors: any
}