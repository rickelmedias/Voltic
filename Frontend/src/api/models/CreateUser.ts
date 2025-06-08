import type { UserDTO } from './UserDTO.ts'
import type { UserResponseDTO } from './UserResponseDTO.ts'

/**
 * @description Created
 */
export type CreateUser201 = UserResponseDTO

export type CreateUserMutationRequest = UserDTO

export type CreateUserMutationResponse = CreateUser201

export type CreateUserMutation = {
  Response: CreateUser201
  Request: CreateUserMutationRequest
  Errors: any
}