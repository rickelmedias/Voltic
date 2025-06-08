import type { Pageable } from './Pageable.ts'
import type { PageUserResponseDTO } from './PageUserResponseDTO.ts'

export type GetAllUsersQueryParams = {
  /**
   * @type object
   */
  pageable: Pageable
}

/**
 * @description OK
 */
export type GetAllUsers200 = PageUserResponseDTO

export type GetAllUsersQueryResponse = GetAllUsers200

export type GetAllUsersQuery = {
  Response: GetAllUsers200
  QueryParams: GetAllUsersQueryParams
  Errors: any
}