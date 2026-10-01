import { 
  CreateContractData, 
  UpdateContractData, 
  ContractFilters 
} from '@/modules/contracts/types'

export const contractsApi = {
  async list(filters: ContractFilters, page: number, limit: number) {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.reservationId && { reservationId: filters.reservationId }),
    })
    const res = await fetch(`/api/contracts?${query}`)
    if (!res.ok) throw new Error('Erro ao buscar contratos')
    return res.json()
  },

  async create(data: CreateContractData) {
    const res = await fetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Erro ao criar contrato')
    return res.json()
  },

  async get(id: string) {
    const res = await fetch(`/api/contracts/${id}`)
    if (!res.ok) throw new Error('Erro ao buscar contrato')
    return res.json()
  },

  async sign(id: string, data: UpdateContractData) {
    const res = await fetch(`/api/contracts/${id}/sign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Erro ao assinar contrato')
    return res.json()
  },
}
