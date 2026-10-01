import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import {
  getChairBlocks,
  createChairBlock,
  deleteChairBlock,
  type ChairBlockDto,
  type ChairBlockFilters,
  type CreateChairBlockData,
} from '../api/chair_blocks'
import type { PaginatedResponse } from '@/shared/types'
import { getApiErrorMessage } from '@/shared/api/client'

export const chairBlockKeys = {
  all:    () => ['chair-blocks'] as const,
  lists:  () => ['chair-blocks', 'list'] as const,
  list:   (f: ChairBlockFilters) => ['chair-blocks', 'list', f] as const,
}

export function useChairBlocks(
  filters: ChairBlockFilters = {},
): UseQueryResult<PaginatedResponse<ChairBlockDto>> {
  return useQuery({
    queryKey: chairBlockKeys.list(filters),
    queryFn:  () => getChairBlocks(filters),
  })
}

export function useCreateChairBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateChairBlockData) => createChairBlock(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chairBlockKeys.all() })
      void queryClient.invalidateQueries({ queryKey: ['chairs'] })
    },
  })
}

export function useDeleteChairBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteChairBlock(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chairBlockKeys.all() })
      void queryClient.invalidateQueries({ queryKey: ['chairs'] })
    },
  })
}

export { getApiErrorMessage }
