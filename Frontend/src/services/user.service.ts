// src/services/user.service.ts

import { createUser as createUserAPI } from "@/api/client/createUser";
import type { UserDTO } from "@/api/models/UserDTO";
import type { UserResponseDTO } from "@/api/models/UserResponseDTO";

/**
 * Envia uma solicitação de criação de usuário (registro).
 *
 * Usa o client gerado pelo KUBB para fazer um POST em /api/v1/users.
 *
 * @param data Dados do usuário no formato UserDTO.
 * @returns A promise que resolve com o UserResponseDTO.
 */
export async function createUser(data: UserDTO): Promise<UserResponseDTO> {
  try {
    const response = await createUserAPI(data);
    return response;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
}
