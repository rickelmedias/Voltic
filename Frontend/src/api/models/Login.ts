import type { LoginRequestDTO } from './LoginRequestDTO.ts'
import type { LoginResponseDTO } from './LoginResponseDTO.ts'

/**
 * @description OK
 */
export type Login200 = LoginResponseDTO

export type LoginMutationRequest = LoginRequestDTO

export type LoginMutationResponse = Login200

export type LoginMutation = {
  Response: Login200
  Request: LoginMutationRequest
  Errors: any
}