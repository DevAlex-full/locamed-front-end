import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import {
  getChairs,
  getChair,
  createChair,
  updateChair,
  deleteChair,
  type ChairDto,
  type ChairsFilters,
  type CreateChairData,
  type UpdateChairData,
} from '../api/chairs'
import type { PaginatedResponse } from '@/shared/types'
import { getApiErrorMessage } from '@/shared/api/client'

// =============================================================================
// Chairs Hooks — TanStack Query v5
// =============================================================================
//
// Query keys hierarquicas:
//   ['chairs']                    → namespace raiz (invalidacao em massa)
//   ['chairs', 'list', filters]   → listagem paginada
//   ['chairs', 'detail', id]      → poltrona individual
// =============================================================================

export const chairsKeys = {
  all:    () => ['chairs'] as const,
  lists:  () => ['chairs', 'list'] as const,
  list:   (filters: ChairsFilters) => ['chairs', 'list', filters] as const,
  detail: (id: string) => ['chairs', 'detail', id] as const,
}

// ── Lista paginada ────────────────────────────────────────────────────────────
export function useChairs(
  filters: ChairsFilters = {},
): UseQueryResult<PaginatedResponse<ChairDto>> {
  return useQuery({
    queryKey: chairsKeys.list(filters),
    queryFn:  () => getChairs(filters),
  })
}

// ── Poltrona individual ───────────────────────────────────────────────────────
export function useChair(id: string | null): UseQueryResult<ChairDto> {
  return useQuery({
    queryKey: chairsKeys.detail(id ?? ''),
    queryFn:  () => getChair(id!),
    enabled:  !!id,
  })
}

// ── Criar poltrona ────────────────────────────────────────────────────────────
export function useCreateChair() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateChairData) => createChair(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chairsKeys.all() })
    },
  })
}

// ── Atualizar poltrona ────────────────────────────────────────────────────────
export function useUpdateChair() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChairData }) =>
      updateChair(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: chairsKeys.all() })
      void queryClient.invalidateQueries({ queryKey: chairsKeys.detail(id) })
    },
  })
}

// ── Remover poltrona (soft delete) ────────────────────────────────────────────
export function useDeleteChair() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteChair(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chairsKeys.all() })
    },
  })
}

export { getApiErrorMessage }