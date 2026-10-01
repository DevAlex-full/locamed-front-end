import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contractsApi } from '../api/contracts'
import { type CreateContractData, type UpdateContractData, type ContractFilters } from '../types'

export function useContracts(filters: ContractFilters, page: number, limit: number) {
  return useQuery({
    queryKey: ['contracts', filters, page, limit],
    queryFn: () => contractsApi.list(filters, page, limit),
  })
}

export function useCreateContract() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateContractData) => contractsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

export function useSignContract() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateContractData }) => contractsApi.sign(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] })
    },
  })
}

export function useContract(id: string) {
  return useQuery({
    queryKey: ['contracts', id],
    queryFn: () => contractsApi.get(id),
    enabled: !!id,
  })
}
