import { api } from '@/shared/api/client'
import { 
  CreateFinancialTransactionData, 
  FinancialTransactionFilters 
} from '../types'

export const financialApi = {
  async list(filters: FinancialTransactionFilters, page = 1, limit = 20) {
    const params = { 
      ...filters, 
      page, 
      limit 
    }
    const { data } = await api.get(`/financial`, { params })
    return data
  },

  async create(data: CreateFinancialTransactionData) {
    const { data: response } = await api.post(`/financial`, data)
    return response
  },

  async updateStatus(id: string, status: string, paidAt?: string) {
    const { data: response } = await api.patch(`/financial/${id}/status`, {
      status,
      paidAt,
    })
    return response
  },
}
