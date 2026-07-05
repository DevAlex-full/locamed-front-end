import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  type ClientDto,
  type ClientsFilters,
  type CreateClientData,
  type UpdateClientData,
} from '../api/clients'
import type { PaginatedResponse } from '@/shared/types'
import { getApiErrorMessage } from '@/shared/api/client'

// =============================================================================
// Clients Hooks — TanStack Query v5
// =============================================================================
//
// Query keys hierarquicas:
//   ['clients']           → namespace raiz (invalidacao em massa)
//   ['clients', 'list', filters] → listagem paginada com filtros
//   ['clients', 'detail', id]    → cliente individual
//
// Invalidacao automatica:
//   Mutations (create, update, delete) invalidam ['clients'] inteiro,
//   forcando re-fetch da lista e dos detalhes em cache.
// =============================================================================

export const clientsKeys = {
  all:    () => ['clients'] as const,
  lists:  () => ['clients', 'list'] as const,
  list:   (filters: ClientsFilters) => ['clients', 'list', filters] as const,
  detail: (id: string) => ['clients', 'detail', id] as const,
}

// ── Lista paginada ────────────────────────────────────────────────────────────
export function useClients(
  filters: ClientsFilters = {},
): UseQueryResult<PaginatedResponse<ClientDto>> {
  return useQuery({
    queryKey: clientsKeys.list(filters),
    queryFn:  () => getClients(filters),
  })
}

// ── Cliente individual ────────────────────────────────────────────────────────
export function useClient(
  id: string | null,
): UseQueryResult<ClientDto> {
  return useQuery({
    queryKey: clientsKeys.detail(id ?? ''),
    queryFn:  () => getClient(id!),
    enabled:  !!id,
  })
}

// ── Criar cliente ─────────────────────────────────────────────────────────────
export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClientData) => createClient(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clientsKeys.all() })
    },
  })
}

// ── Atualizar cliente ─────────────────────────────────────────────────────────
export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientData }) =>
      updateClient(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: clientsKeys.all() })
      void queryClient.invalidateQueries({ queryKey: clientsKeys.detail(id) })
    },
  })
}

// ── Remover cliente (soft delete) ─────────────────────────────────────────────
export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clientsKeys.all() })
    },
  })
}

// ── Helper: extrai mensagem de erro de uma mutation ───────────────────────────
export { getApiErrorMessage }