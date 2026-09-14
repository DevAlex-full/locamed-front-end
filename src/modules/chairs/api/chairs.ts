import { api } from '@/shared/api/client'
import type { ApiSuccess, PaginatedResponse } from '@/shared/types'

// =============================================================================
// Chairs API — Funcoes tipadas para o backend /chairs
// =============================================================================

// ChairStatus espelha o enum do backend (ChairStatus do Prisma)
export const CHAIR_STATUS = {
  available:    'available',
  reserved:     'reserved',
  in_delivery:  'in_delivery',
  rented:       'rented',
  in_pickup:    'in_pickup',
  sanitization: 'sanitization',
  maintenance:  'maintenance',
  inactive:     'inactive',
} as const

export type ChairStatus = (typeof CHAIR_STATUS)[keyof typeof CHAIR_STATUS]

// Statuses que podem ser definidos manualmente (os demais sao gerenciados por Reservas)
export const MANUAL_STATUSES: ChairStatus[] = [
  CHAIR_STATUS.available,
  CHAIR_STATUS.maintenance,
  CHAIR_STATUS.sanitization,
  CHAIR_STATUS.inactive,
]

// Labels em portugues para exibicao
export const CHAIR_STATUS_LABEL: Record<ChairStatus, string> = {
  available:    'Disponivel',
  reserved:     'Reservado',
  in_delivery:  'Em entrega',
  rented:       'Alugado',
  in_pickup:    'Em retirada',
  sanitization: 'Sanitizacao',
  maintenance:  'Manutencao',
  inactive:     'Inativo',
}

// Classes Tailwind para badge de status
export const CHAIR_STATUS_COLOR: Record<ChairStatus, string> = {
  available:    'bg-green-100  text-green-800  border-green-200',
  reserved:     'bg-blue-100   text-blue-800   border-blue-200',
  in_delivery:  'bg-amber-100  text-amber-800  border-amber-200',
  rented:       'bg-purple-100 text-purple-800 border-purple-200',
  in_pickup:    'bg-amber-100  text-amber-800  border-amber-200',
  sanitization: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  maintenance:  'bg-red-100    text-red-800    border-red-200',
  inactive:     'bg-gray-100   text-gray-500   border-gray-200',
}

// ── Tipo DTO alinhado ao backend ──────────────────────────────────────────────
export interface ChairDto {
  id:               string
  companyId:        string
  code:             string
  patrimonyNumber:  string | null
  model:            string | null
  manufacturer:     string | null
  acquisitionDate:  string | null
  acquisitionValue: string | null
  status:           ChairStatus
  notes:            string | null
  createdAt:        string
  updatedAt:        string
}

export interface CreateChairData {
  code:             string
  patrimonyNumber?: string | null
  model?:           string | null
  manufacturer?:    string | null
  acquisitionDate?: string | null
  acquisitionValue?: number | null
  status?:          ChairStatus
  notes?:           string | null
}

export type UpdateChairData = Partial<CreateChairData>

export interface ChairsFilters {
  search?: string
  status?: ChairStatus
  page?:   number
  limit?:  number
}

// ── Funcoes de API ────────────────────────────────────────────────────────────

export async function getChairs(
  filters: ChairsFilters = {},
): Promise<PaginatedResponse<ChairDto>> {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.status) params.set('status', filters.status)
  if (filters.page)   params.set('page',   String(filters.page))
  if (filters.limit)  params.set('limit',  String(filters.limit))

  const { data } = await api.get<PaginatedResponse<ChairDto>>(
    `/chairs?${params.toString()}`,
  )
  return data
}

export async function getChair(id: string): Promise<ChairDto> {
  const { data } = await api.get<ApiSuccess<ChairDto>>(`/chairs/${id}`)
  return data.data
}

export async function createChair(payload: CreateChairData): Promise<ChairDto> {
  const { data } = await api.post<ApiSuccess<ChairDto>>('/chairs', payload)
  return data.data
}

export async function updateChair(
  id:      string,
  payload: UpdateChairData,
): Promise<ChairDto> {
  const { data } = await api.patch<ApiSuccess<ChairDto>>(`/chairs/${id}`, payload)
  return data.data
}

export async function deleteChair(id: string): Promise<void> {
  await api.delete(`/chairs/${id}`)
}