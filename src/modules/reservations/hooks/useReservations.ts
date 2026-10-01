import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import {
  getReservations,
  getReservation,
  createReservation,
  updateReservationStatus,
  deleteReservation,
  type ReservationDto,
  type ReservationsFilters,
  type CreateReservationData,
  type ReservationStatus,
} from '../api/reservations'
import type { PaginatedResponse } from '@/shared/types'
import { getApiErrorMessage } from '@/shared/api/client'

// =============================================================================
// Reservations Hooks — TanStack Query v5
// =============================================================================

export const reservationsKeys = {
  all:    () => ['reservations'] as const,
  lists:  () => ['reservations', 'list'] as const,
  list:   (f: ReservationsFilters) => ['reservations', 'list', f] as const,
  detail: (id: string)             => ['reservations', 'detail', id] as const,
}

export function useReservations(
  filters: ReservationsFilters = {},
): UseQueryResult<PaginatedResponse<ReservationDto>> {
  return useQuery({
    queryKey: reservationsKeys.list(filters),
    queryFn:  () => getReservations(filters),
  })
}

export function useReservation(id: string | null): UseQueryResult<ReservationDto> {
  return useQuery({
    queryKey: reservationsKeys.detail(id ?? ''),
    queryFn:  () => getReservation(id!),
    enabled:  !!id,
  })
}

export function useCreateReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReservationData) => createReservation(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reservationsKeys.all() })
      // Invalida chairs pois o status da poltrona muda para reserved
      void queryClient.invalidateQueries({ queryKey: ['chairs'] })
    },
  })
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReservationStatus }) =>
      updateReservationStatus(id, status),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: reservationsKeys.all() })
      void queryClient.invalidateQueries({ queryKey: reservationsKeys.detail(id) })
      // Invalida chairs pois cancelamento libera a poltrona
      void queryClient.invalidateQueries({ queryKey: ['chairs'] })
    },
  })
}

export function useDeleteReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteReservation(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reservationsKeys.all() })
      void queryClient.invalidateQueries({ queryKey: ['chairs'] })
    },
  })
}

export { getApiErrorMessage }