import { api } from '@/shared/api/client'
import type { ApiSuccess, PaginatedResponse } from '@/shared/types'

// =============================================================================
// Clients API — Funcoes tipadas para o backend /clients
// =============================================================================

// ── Tipos alinhados ao ClientDto do backend ───────────────────────────────────
export interface ClientDto {
  id:           string
  companyId:    string
  name:         string
  cpf:          string
  rg:           string | null
  birthDate:    string | null
  phone:        string
  whatsapp:     string | null
  email:        string | null
  zipCode:      string | null
  address:      string | null
  number:       string | null
  complement:   string | null
  neighborhood: string | null
  city:         string | null
  state:        string | null
  doctor:       string | null
  hospital:     string | null
  surgeryDate:  string | null
  notes:        string | null
  createdAt:    string
  updatedAt:    string
}

export interface CreateClientData {
  name:          string
  cpf:           string
  phone:         string
  rg?:           string | null
  birthDate?:    string | null
  whatsapp?:     string | null
  email?:        string | null
  zipCode?:      string | null
  address?:      string | null
  number?:       string | null
  complement?:   string | null
  neighborhood?: string | null
  city?:         string | null
  state?:        string | null
  doctor?:       string | null
  hospital?:     string | null
  surgeryDate?:  string | null
  notes?:        string | null
}

export type UpdateClientData = Partial<CreateClientData>

export interface ClientsFilters {
  search?: string
  page?:   number
  limit?:  number
}

// ── Funções de API ────────────────────────────────────────────────────────────

export async function getClients(
  filters: ClientsFilters = {},
): Promise<PaginatedResponse<ClientDto>> {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.page)   params.set('page',   String(filters.page))
  if (filters.limit)  params.set('limit',  String(filters.limit))

  const { data } = await api.get<PaginatedResponse<ClientDto>>(
    `/clients?${params.toString()}`,
  )
  return data
}

export async function getClient(id: string): Promise<ClientDto> {
  const { data } = await api.get<ApiSuccess<ClientDto>>(`/clients/${id}`)
  return data.data
}

export async function createClient(payload: CreateClientData): Promise<ClientDto> {
  const { data } = await api.post<ApiSuccess<ClientDto>>('/clients', payload)
  return data.data
}

export async function updateClient(
  id:      string,
  payload: UpdateClientData,
): Promise<ClientDto> {
  const { data } = await api.patch<ApiSuccess<ClientDto>>(`/clients/${id}`, payload)
  return data.data
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`)
}