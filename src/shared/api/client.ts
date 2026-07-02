import axios, { type AxiosError } from 'axios'
import { supabase } from '@/shared/lib/supabase'

// =============================================================================
// API Client — Axios para o backend Fastify
// =============================================================================
//
// Todas as chamadas ao backend Fastify passam por este client.
// Supabase Auth (login, logout, refresh) usa src/shared/lib/supabase.ts.
//
// Interceptors:
//   Request  → injeta Bearer token da sessao Supabase em cada requisicao
//   Response → trata 401: faz logout e redireciona para /login
// =============================================================================

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

// Injeta JWT do Supabase em cada requisicao
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Trata 401: sessao expirada ou revogada
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    if (data?.message) return data.message
    if (error.message) return error.message
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}