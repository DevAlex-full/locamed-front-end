export interface FinancialTransaction {
  id: string
  company_id: string
  reservation_id: string
  type: 'charge' | 'refund' | 'commission_payment'
  amount: number | string
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  payment_method: string | null
  asaas_id: string | null
  asaas_link: string | null
  due_date: string
  paid_at: string | null
  description: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreateFinancialTransactionData {
  reservationId: string
  type: 'charge' | 'refund' | 'commission_payment'
  amount: number
  paymentMethod?: string
  dueDate: string
  description: string
  metadata?: Record<string, any>
}

export interface FinancialTransactionFilters {
  status?: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  type?: 'charge' | 'refund' | 'commission_payment'
  reservationId?: string
}
