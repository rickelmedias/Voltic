// src/services/auth.service.ts

import { login as loginAPI } from "@/api/client/login";
import type { LoginRequestDTO } from "@/api/models/LoginRequestDTO";
import type { LoginResponseDTO } from "@/api/models/LoginResponseDTO";

/**
 * Realiza login do usuário com credenciais e retorna o token JWT.
 * Usa a função gerada pelo Kubb para chamar o endpoint /api/v1/auth/login.
 *
 * @param data Credenciais de login
 * @returns Token JWT do usuário
 */
export async function login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
  try {
    const response = await loginAPI(data);
    return response;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}
