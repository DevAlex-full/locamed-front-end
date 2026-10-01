export interface Contract {
  id: string
  company_id: string
  reservation_id: string
  version: number
  storage_url: string
  signed_at: string | null
  signed_by: string | null
  signature_ip: string | null
  created_at: string
  updated_at: string
}

export interface CreateContractData {
  reservationId: string
  version?: number
  storageUrl: string
}

export interface UpdateContractData {
  signedAt?: string
  signedBy?: string
  signatureIp?: string
  notes?: string
}

export interface ContractFilters {
  reservationId?: string
  companyId?: string
  page?: number
}
