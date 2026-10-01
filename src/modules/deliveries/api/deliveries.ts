import { api } from '@/shared/api/client'
import type { ApiSuccess, PaginatedResponse } from '@/shared/types'

// =============================================================================
// Deliveries API
// =============================================================================

export interface DeliveryDto {
  id: string
  company_id: string
  reservation_id: string
  driver_id: string | null
  type: 'delivery' | 'pickup'
  scheduled_at: string
  completed_at: string | null
  address: string
  notes: string | null
  latitude: number | null
  longitude: number | null
  signature_url: string | null
  created_at: string
  updated_at: string
  reservationName?: string
}

export interface CreateDeliveryData {
  reservationId: string
  type: 'delivery' | 'pickup'
  scheduledAt: string
  address: string
  notes?: string | null
}

export interface DeliveryFilters {
  type?: 'delivery' | 'pickup'
  page?: number
  limit?: number
}

export async function getDeliveries(
  filters: DeliveryFilters = {},
): Promise<PaginatedResponse<DeliveryDto>> {
  const params = new URLSearchParams()
  if (filters.type) params.set('type', filters.type)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  
  const { data } = await api.get<PaginatedResponse<DeliveryDto>>(
    `/deliveries?${params.toString()}`,
  )
  return data
}

export async function createDelivery(
  payload: CreateDeliveryData,
): Promise<DeliveryDto> {
  const { data } = await api.post<ApiSuccess<DeliveryDto>>('/deliveries', payload)
  return data.data
}

export async function deleteDelivery(id: string): Promise<void> {
  await api.delete(`/deliveries/${id}`)
}
