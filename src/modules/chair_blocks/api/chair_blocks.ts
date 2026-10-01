import { api } from '@/shared/api/client'
import type { ApiSuccess, PaginatedResponse } from '@/shared/types'

// =============================================================================
// Chair Blocks API
// =============================================================================

export const CHAIR_BLOCK_TYPE = {
  maintenance: 'maintenance',
  sanitization: 'sanitization',
  manual: 'manual',
  administrative: 'administrative',
} as const

export type ChairBlockType = (typeof CHAIR_BLOCK_TYPE)[keyof typeof CHAIR_BLOCK_TYPE]

export const CHAIR_BLOCK_TYPE_LABEL: Record<ChairBlockType, string> = {
  maintenance: 'Manutenção',
  sanitization: 'Higienização',
  manual: 'Manual',
  administrative: 'Administrativo',
}

export interface ChairBlockDto {
  id: string
  company_id: string
  chair_id: string
  type: ChairBlockType
  reason: string
  blocked_by: string
  start_date: string
  end_date: string
  resolved_at: string | null
  resolved_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
  chairCode?: string
}

export interface CreateChairBlockData {
  chairId: string
  type: ChairBlockType
  reason: string
  startDate: string
  endDate: string
  notes?: string | null
}

export interface ChairBlockFilters {
  type?: ChairBlockType
  page?: number
  limit?: number
}

export async function getChairBlocks(
  filters: ChairBlockFilters = {},
): Promise<PaginatedResponse<ChairBlockDto>> {
  const params = new URLSearchParams()
  if (filters.type) params.set('type', filters.type)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  
  const { data } = await api.get<PaginatedResponse<ChairBlockDto>>(
    `/chair-blocks?${params.toString()}`,
  )
  return data
}

export async function createChairBlock(
  payload: CreateChairBlockData,
): Promise<ChairBlockDto> {
  const { data } = await api.post<ApiSuccess<ChairBlockDto>>('/chair-blocks', payload)
  return data.data
}

export async function deleteChairBlock(id: string): Promise<void> {
  await api.delete(`/chair-blocks/${id}`)
}
