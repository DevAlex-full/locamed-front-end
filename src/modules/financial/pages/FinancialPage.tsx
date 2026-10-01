import React, { useState } from 'react'
import { 
  Plus, Filter, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight 
} from 'lucide-react'
import { useFinancial } from '../hooks/useFinancial'
import { type FinancialTransactionFilters } from '../types'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'

const transactionSchema = z.object({
  reservationId: z.string().min(1, 'Reserva é obrigatória'),
  type: z.enum(['charge', 'refund', 'commission_payment']),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  paymentMethod: z.string().optional(),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  description: z.string().min(3, 'Descrição muito curta'),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

export function FinancialPage() {
  const { useList, createMutation, updateStatusMutation } = useFinancial()
  
  const [filters, setFilters] = useState<FinancialTransactionFilters>({})
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading } = useList(filters, page, limit)
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'charge',
      paymentMethod: 'PIX',
      dueDate: new Date().toISOString().split('T')[0],
      description: '',
    }
  })

  const handleCreate = (values: TransactionFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Transação criada com sucesso')
        form.reset()
      },
      onError: () => toast.error('Erro ao criar transação')
    })
  }

  const handleMarkAsPaid = (id: string) => {
    updateStatusMutation.mutate({ 
      id, 
      status: 'paid', 
      paidAt: new Date().toISOString() 
    }, {
      onSuccess: () => toast.success('Transação marcada como paga'),
      onError: () => toast.error('Erro ao atualizar status')
    })
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any }> = {
      paid: { color: 'bg-green-500', icon: CheckCircle },
      pending: { color: 'bg-yellow-500', icon: Clock },
      failed: { color: 'bg-red-500', icon: XCircle },
      refunded: { color: 'bg-blue-500', icon: Filter },
      cancelled: { color: 'bg-gray-500', icon: XCircle },
    }
    const { color, icon: Icon } = config[status] || { color: 'bg-gray-400', icon: Clock }
    return (
      <span className={`${color} text-white flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-xs font-medium`}>
        <Icon size={12} /> {status}
      </span>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Controle Financeiro</h1>
          <p className="text-muted-foreground">Gestão de cobranças, reembolsos e comissões.</p>
        </div>
        
        <button 
          onClick={() => {
            const resId = prompt('ID da Reserva:');
            if(!resId) return;
            const type = prompt('Tipo (charge, refund, commission_payment):', 'charge');
            const amount = prompt('Valor:');
            const dueDate = new Date().toISOString().split('T')[0];
            const description = prompt('Descrição:');
            
            if(resId && amount && description) {
              handleCreate({
                reservationId: resId,
                type: type as any,
                amount: Number(amount),
                dueDate,
                description
              });
            }
          }}
          disabled={createMutation.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Nova Transação
        </button>
      </div>

      <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select 
            className="block w-40 rounded-md border bg-background px-3 py-2 text-sm"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(f => ({ ...f, status: e.target.value as any }))}
          >
            <option value="">Todos</option>
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
            <option value="failed">Falhou</option>
            <option value="refunded">Reembolsado</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo</label>
          <select 
            className="block w-40 rounded-md border bg-background px-3 py-2 text-sm"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(f => ({ ...f, type: e.target.value as any }))}
          >
            <option value="">Todos</option>
            <option value="charge">Cobrança</option>
            <option value="refund">Reembolso</option>
            <option value="commission_payment">Comissão</option>
          </select>
        </div>
        <div className="space-y-2 flex-1">
          <label className="text-sm font-medium">Reserva ID</label>
          <input 
            placeholder="Buscar por reserva..." 
            className="w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.reservationId || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(f => ({ ...f, reservationId: e.target.value, page: 1 }))}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Reserva</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Vencimento</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-10">Carregando...</td></tr>
            ) : data?.data?.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Nenhuma transação encontrada.</td></tr>
            ) : (
              data?.data?.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{tx.reservation_id}</td>
                  <td className="px-4 py-3 capitalize">{tx.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-medium">R$ {Number(tx.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">{format(new Date(tx.due_date), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3">{getStatusBadge(tx.status)}</td>
                  <td className="px-4 py-3 text-right">
                    {tx.status === 'pending' && (
                      <button 
                        onClick={() => handleMarkAsPaid(tx.id)}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium hover:bg-accent disabled:opacity-50"
                      >
                        Marcar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button 
          onClick={() => setPage(p => p - 1)} 
          disabled={page <= 1}
          className="p-1.5 rounded-md border bg-background hover:bg-accent disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs font-medium">Página {page} de {data?.totalPages || 1}</span>
        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={page >= (data?.totalPages || 1)}
          className="p-1.5 rounded-md border bg-background hover:bg-accent disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
