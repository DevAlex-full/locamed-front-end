import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { financialApi } from '../api/financial'
import { type FinancialTransactionFilters, type CreateFinancialTransactionData } from '../types'

export function useFinancial() {
  const queryClient = useQueryClient()

  const useList = (filters: FinancialTransactionFilters, page: number, limit: number) => {
    return useQuery({
      queryKey: ['financial-transactions', filters, page, limit],
      queryFn: () => financialApi.list(filters, page, limit),
    })
  }

  const createMutation = useMutation({
    mutationFn: (data: CreateFinancialTransactionData) => financialApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] })
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, paidAt }: { id: string; status: string; paidAt?: string }) => 
      financialApi.updateStatus(id, status, paidAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] })
    },
  })

  return {
    useList,
    createMutation,
    updateStatusMutation,
  }
}
