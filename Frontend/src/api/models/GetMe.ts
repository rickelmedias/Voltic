import type { UserResponseDTO } from './UserResponseDTO.ts'

/**
 * @description OK
 */
export type GetMe200 = UserResponseDTO

export type GetMeQueryResponse = GetMe200

export type GetMeQuery = {
  Response: GetMe200
  Errors: any
}