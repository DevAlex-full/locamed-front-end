import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import {
  getDeliveries,
  createDelivery,
  deleteDelivery,
  type DeliveryDto,
  type DeliveryFilters,
  type CreateDeliveryData,
} from '../api/deliveries'
import type { PaginatedResponse } from '@/shared/types'
import { getApiErrorMessage } from '@/shared/api/client'

export const deliveryKeys = {
  all:    () => ['deliveries'] as const,
  lists:  () => ['deliveries', 'list'] as const,
  list:   (f: DeliveryFilters) => ['deliveries', 'list', f] as const,
}

export function useDeliveries(
  filters: DeliveryFilters = {},
): UseQueryResult<PaginatedResponse<DeliveryDto>> {
  return useQuery({
    queryKey: deliveryKeys.list(filters),
    queryFn:  () => getDeliveries(filters),
  })
}

export function useCreateDelivery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDeliveryData) => createDelivery(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: deliveryKeys.all() })
    },
  })
}

export function useDeleteDelivery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDelivery(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: deliveryKeys.all() })
    },
  })
}

export { getApiErrorMessage, type DeliveryFilters }
