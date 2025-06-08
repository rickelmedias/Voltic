import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { API_BASE_URL } from '@/config/api'

export interface RequestConfig<T = any> extends AxiosRequestConfig {
  data?: T
}

export interface ResponseErrorConfig<T = any> {
  data?: T
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') +
        '=([^;]*)',
    ),
  )
  return match ? decodeURIComponent(match[1]) : undefined
}

function eraseCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const path = config.url?.split('?')[0] ?? ''
  const isAuthRoute =
    path.endsWith('/auth/login') || path.endsWith('/auth/register')
  if (!isAuthRoute) {
    const token = getCookie('token')
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as Record<string, string>)[
        'Authorization'
      ] = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado ou inválido. Redirecionando para login...')
      eraseCookie('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default async function client<
  ResponseType = any,
  ErrorType = any,
  RequestType = any,
>(config: RequestConfig<RequestType>): Promise<AxiosResponse<ResponseType>> {
  return api.request(config)
}
