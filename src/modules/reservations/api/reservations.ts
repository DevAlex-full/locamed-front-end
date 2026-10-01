import { api } from '@/shared/api/client'
import type { ApiSuccess, PaginatedResponse } from '@/shared/types'

// =============================================================================
// Reservations API
// =============================================================================

export const RESERVATION_STATUS = {
  pending:   'pending',
  confirmed: 'confirmed',
  active:    'active',
  completed: 'completed',
  cancelled: 'cancelled',
} as const

export type ReservationStatus = (typeof RESERVATION_STATUS)[keyof typeof RESERVATION_STATUS]

export const PAYMENT_STATUS = {
  pending:  'pending',
  awaiting: 'awaiting',
  paid:     'paid',
  overdue:  'overdue',
  refunded: 'refunded',
} as const

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  pending:   'Pendente',
  confirmed: 'Confirmada',
  active:    'Ativa',
  completed: 'Concluida',
  cancelled: 'Cancelada',
}

export const RESERVATION_STATUS_COLOR: Record<ReservationStatus, string> = {
  pending:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100   text-blue-800   border-blue-200',
  active:    'bg-green-100  text-green-800  border-green-200',
  completed: 'bg-gray-100   text-gray-600   border-gray-200',
  cancelled: 'bg-red-100    text-red-800    border-red-200',
}

// Transicoes manuais permitidas via UI
export const STATUS_TRANSITIONS: Partial<Record<ReservationStatus, ReservationStatus[]>> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['active', 'cancelled'],
  active:    ['completed', 'cancelled'],
}

export interface ReservationDto {
  id:            string
  companyId:     string
  clientId:      string
  chairId:       string
  partnerId:     string | null
  startDate:     string
  endDate:       string
  totalDays:     number
  dailyRate:     string
  totalAmount:   string
  discount:      string
  finalAmount:   string
  status:        ReservationStatus
  paymentStatus: PaymentStatus
  paymentMethod: string | null
  notes:         string | null
  createdAt:     string
  updatedAt:     string
  clientName?:   string
  chairCode?:    string
}

export interface CreateReservationData {
  clientId:       string
  chairId:        string
  startDate:      string
  endDate:        string
  dailyRate:      number
  discount?:      number
  partnerId?:     string | null
  paymentMethod?: string | null
  notes?:         string | null
}

export interface ReservationsFilters {
  clientId?: string
  chairId?:  string
  status?:   ReservationStatus
  page?:     number
  limit?:    number
}

// ── Funções de API ────────────────────────────────────────────────────────────

export async function getReservations(
  filters: ReservationsFilters = {},
): Promise<PaginatedResponse<ReservationDto>> {
  const params = new URLSearchParams()
  if (filters.clientId) params.set('clientId', filters.clientId)
  if (filters.chairId)  params.set('chairId',  filters.chairId)
  if (filters.status)   params.set('status',   filters.status)
  if (filters.page)     params.set('page',     String(filters.page))
  if (filters.limit)    params.set('limit',    String(filters.limit))
  const { data } = await api.get<PaginatedResponse<ReservationDto>>(
    `/reservations?${params.toString()}`,
  )
  return data
}

export async function getReservation(id: string): Promise<ReservationDto> {
  const { data } = await api.get<ApiSuccess<ReservationDto>>(`/reservations/${id}`)
  return data.data
}

export async function createReservation(
  payload: CreateReservationData,
): Promise<ReservationDto> {
  const { data } = await api.post<ApiSuccess<ReservationDto>>('/reservations', payload)
  return data.data
}

export async function updateReservationStatus(
  id:     string,
  status: ReservationStatus,
): Promise<ReservationDto> {
  const { data } = await api.patch<ApiSuccess<ReservationDto>>(
    `/reservations/${id}/status`,
    { status },
  )
  return data.data
}

export async function deleteReservation(id: string): Promise<void> {
  await api.delete(`/reservations/${id}`)
}