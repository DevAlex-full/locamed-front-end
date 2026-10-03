import React, { useState, useEffect } from 'react'
import { 
  Plus, Search, Clock, ChevronLeft, ChevronRight, Loader2, X
} from 'lucide-react'
import { useFinancial } from '../hooks/useFinancial'
import { type FinancialTransactionFilters } from '../types'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'

// =============================================================================
// FinancialPage — Módulo Financeiro (Luxury Medical SaaS Edition)
// =============================================================================

const transactionSchema = z.object({
  reservationId: z.string().min(1, 'Reserva é obrigatória'),
  type: z.enum(['charge', 'refund', 'commission_payment']),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  paymentMethod: z.string().optional(),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  description: z.string().min(3, 'Descrição muito curta'),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(typeof value === 'string' ? parseFloat(value) : value)
}

function FieldGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</label>
      {children}
      {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
    </div>
  )
}

function TransactionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { createMutation } = useFinancial()
  const [serverError, setServerError] = useState<string | null>(null)
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'charge',
      paymentMethod: 'PIX',
      dueDate: new Date().toISOString().split('T')[0],
      description: '',
    }
  })

  useEffect(() => {
    if (open) {
      form.reset({
        type: 'charge',
        paymentMethod: 'PIX',
        dueDate: new Date().toISOString().split('T')[0],
        description: '',
      })
      setServerError(null)
    }
  }, [open, form])

  const onSubmit = async (values: TransactionFormValues) => {
    setServerError(null)
    try {
      await createMutation.mutateAsync(values)
      toast.success('Transação criada com sucesso')
      form.reset()
      onClose()
    } catch (err: any) {
      setServerError(err?.message || 'Erro ao criar transação')
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-md border border-slate-200 bg-white shadow-premium p-8">
          <div className="flex items-center justify-between mb-8">
            <Dialog.Title className="text-xl font-semibold text-slate-900">Nova Transação</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-md p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {serverError && (
            <div className="mb-6 rounded-sm border border-destructive/20 bg-destructive/5 px-4 py-3">
              <p className="text-xs text-destructive font-medium">{serverError}</p>
            </div>
          )}

          <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e) }} noValidate className="space-y-6">
            <div className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b pb-2">Referência</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldGroup label="Reserva ID *" error={form.formState.errors.reservationId?.message}>
                  <Input {...form.register('reservationId')} placeholder="UUID da Reserva" />
                </FieldGroup>
                <FieldGroup label="Tipo de Operação *">
                  <select 
                    {...form.register('type')} 
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="charge">Cobrança (Charge)</option>
                    <option value="refund">Reembolso (Refund)</option>
                    <option value="commission_payment">Pagamento de Comissão</option>
                  </select>
                </FieldGroup>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b pb-2">Valores e Datas</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FieldGroup label="Valor *" error={form.formState.errors.amount?.message}>
                  <Input {...form.register('amount')} type="number" step="0.01" placeholder="0,00" />
                </FieldGroup>
                <FieldGroup label="Vencimento *" error={form.formState.errors.dueDate?.message}>
                  <Input {...form.register('dueDate')} type="date" />
                </FieldGroup>
                <FieldGroup label="Método de Pagamento">
                  <Input {...form.register('paymentMethod')} placeholder="PIX, Cartão, etc" />
                </FieldGroup>
              </div>
            </div>

            <FieldGroup label="Descrição *" error={form.formState.errors.description?.message}>
              <textarea 
                {...form.register('description')} 
                rows={3} 
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                placeholder="Detalhes da transação..."
              />
            </FieldGroup>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <Dialog.Close asChild>
                <Button variant="ghost">Cancelar</Button>
              </Dialog.Close>
              <Button type="submit" disabled={createMutation.isPending} className="px-8">
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Confirmar Transação
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function FinancialPage() {
  const { useList, updateStatusMutation } = useFinancial()
  const [filters, setFilters] = useState<FinancialTransactionFilters>({})
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const limit = 20

  const { data, isLoading } = useList(filters, page, limit)

  const handleMarkAsPaid = async (id: string) => {
    try {
      await updateStatusMutation.mutateAsync({ 
        id, 
        status: 'paid', 
        paidAt: new Date().toISOString() 
      })
      toast.success('Transação marcada como paga')
    } catch (err) {
      toast.error('Erro ao atualizar status')
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      paid: { color: 'text-green-700 bg-green-50 border-green-200', label: 'Pago' },
      pending: { color: 'text-amber-700 bg-amber-50 border-amber-200', label: 'Pendente' },
      failed: { color: 'text-destructive bg-red-50 border-red-200', label: 'Falhou' },
      refunded: { color: 'text-blue-700 bg-blue-50 border-blue-200', label: 'Reembolsado' },
      cancelled: { color: 'text-slate-600 bg-slate-50 border-slate-200', label: 'Cancelado' },
    }
    const { color, label } = config[status] || { color: 'text-slate-600 bg-slate-50 border-slate-200', label: status }
    return (
      <Badge variant="outline" className={cn('rounded-sm font-medium', color)}>
        {label}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Controle Financeiro</h1>
          <p className="text-sm text-slate-500 mt-1">Gestão de cobranças, reembolsos e fluxo de caixa.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="px-4">
          <Plus className="h-4 w-4 mr-2" /> Nova Transação
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-slate-200 shadow-premium">
        <div className="flex flex-wrap gap-4 w-full justify-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
            <select 
              className="block w-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value as any || undefined, page: 1 }))}
              value={filters.status || ''}
            >
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="failed">Falhou</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tipo</span>
            <select 
              className="block w-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              onChange={(e) => setFilters(f => ({ ...f, type: e.target.value as any || undefined, page: 1 }))}
              value={filters.type || ''}
            >
              <option value="">Todos</option>
              <option value="charge">Cobrança</option>
              <option value="refund">Reembolso</option>
              <option value="commission_payment">Comissão</option>
            </select>
          </div>
          <div className="space-y-1 flex-1 max-w-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reserva ID</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar por ID da reserva..." 
                className="pl-9"
                value={filters.reservationId || ''}
                onChange={(e) => setFilters(f => ({ ...f, reservationId: e.target.value, page: 1 }))}
              />
            </div>
          </div>
        </div>
      </div>

      <Card className="border-slate-200 shadow-premium">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reserva</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-slate-300" />
                    Carregando transações...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Nenhuma transação encontrada.</p>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && data?.data?.map((tx: any) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs text-slate-600">{tx.reservation_id}</TableCell>
                  <TableCell className="capitalize text-slate-600">{tx.type.replace('_', ' ')}</TableCell>
                  <TableCell className="font-medium text-slate-900">{formatCurrency(tx.amount)}</TableCell>
                  <TableCell className="text-slate-600">{format(new Date(tx.due_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="text-right">
                    {tx.status === 'pending' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleMarkAsPaid(tx.id)}
                        disabled={updateStatusMutation.isPending}
                        className="h-8 px-3 text-xs font-medium hover:text-green-600 hover:bg-green-50"
                      >
                        Marcar Pago
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {data?.totalPages && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-2">
          <span>Página {page} de {data.totalPages} ({data.total} registros)</span>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page <= 1}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} 
              disabled={page >= data.totalPages}
              className="h-8 px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <TransactionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
