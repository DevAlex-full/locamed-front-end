import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { z } from 'zod'
import {
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  useDeliveries, 
  useCreateDelivery, 
  useDeleteDelivery, 
  getApiErrorMessage,
  type DeliveryFilters 
} from '../hooks/useDeliveries'
import { useReservations } from '@/modules/reservations/hooks/useReservations'

const deliveryFormSchema = z.object({
  reservationId: z.string().uuid('Selecione a reserva'),
  type: z.enum(['delivery', 'pickup'], { errorMap: () => ({ message: 'Tipo obrigatorio' }) }),
  scheduledAt: z.string().min(1, 'Data e hora obrigatoria'),
  address: z.string().min(5, 'Endereco obrigatorio'),
  notes: z.string().optional(),
})

type DeliveryFormData = z.infer<typeof deliveryFormSchema>

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('pt-BR')
}

function DeliveryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createMutation = useCreateDelivery()
  const [serverError, setServerError] = useState<string | null>(null)
  
  const { data: resData } = useReservations({ limit: 100 })
  const reservations = resData?.data ?? []

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: { type: 'delivery' },
  })

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) { reset(); setServerError(null); onClose() }
  }

  const onSubmit = async (form: DeliveryFormData) => {
    setServerError(null)
    try {
      await createMutation.mutateAsync({
        reservationId: form.reservationId,
        type: form.type,
        scheduledAt: form.scheduledAt,
        address: form.address,
        notes: form.notes || null,
      })
      reset()
      onClose()
    } catch (err) {
      setServerError(getApiErrorMessage(err))
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-xl border bg-background p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-lg font-semibold">Agendar Entrega/Retirada</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent transition-colors">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>
          {serverError && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}
          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium">Reserva *</label>
              <select {...register('reservationId')} className={cn('w-full rounded-md border px-3 py-2 text-sm bg-background', errors.reservationId && 'border-destructive')}>
                <option value="">Selecione a reserva...</option>
                {reservations.map(r => <option key={r.id} value={r.id}>{r.clientName} - {r.chairCode}</option>)}
              </select>
              {errors.reservationId && <p className="text-xs text-destructive">{errors.reservationId.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium">Tipo *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" {...register('type')} value="delivery" /> Entrega
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" {...register('type')} value="pickup" /> Retirada
                </label>
              </div>
              {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium">Data e Hora Agendada *</label>
              <input type="datetime-local" {...register('scheduledAt')} className={cn('w-full rounded-md border px-3 py-2 text-sm bg-background', errors.scheduledAt && 'border-destructive')} />
              {errors.scheduledAt && <p className="text-xs text-destructive">{errors.scheduledAt.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium">Endereço *</label>
              <input {...register('address')} className={cn('w-full rounded-md border px-3 py-2 text-sm bg-background', errors.address && 'border-destructive')} />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium">Observações</label>
              <textarea {...register('notes')} rows={2} className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t">
              <Dialog.Close asChild>
                <button type="button" className="rounded-md px-4 py-2 text-sm border hover:bg-accent">Cancelar</button>
              </Dialog.Close>
              <button type="submit" disabled={createMutation.isPending} className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Agendar
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function DeliveriesPage() {
  const [filters, setFilters] = useState<DeliveryFilters>({ page: 1 })
  const [modalOpen, setModalOpen] = useState(false)
  const { data, isLoading, isError } = useDeliveries(filters)
  const deleteMutation = useDeleteDelivery()

  const deliveries = data?.data ?? []
  const meta = data?.meta
  const page = filters.page ?? 1
  const totalPages = meta?.totalPages ?? 1

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestão de Entregas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{meta ? `${meta.total} agendamentos` : 'Carregando...'}</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Novo Agendamento
        </button>
      </div>
      <div className="flex gap-2">
        <select 
          value={filters.type ?? ''} 
          onChange={(e) => setFilters((f: DeliveryFilters) => ({ ...f, type: e.target.value as any || undefined, page: 1 }))}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos os tipos</option>
          <option value="delivery">Entrega</option>
          <option value="pickup">Retirada</option>
        </select>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reserva</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Agendado</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Endereço</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-12"><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />Carregando...</td></tr>
            ) : isError ? (
              <tr><td colSpan={5} className="text-center py-12 text-destructive">Erro ao carregar entregas.</td></tr>
            ) : deliveries.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Nenhum agendamento encontrado.</td></tr>
            ) : (
              deliveries.map((d, i) => (
                <tr key={d.id} className={cn('border-b last:border-0', i % 2 === 0 ? 'bg-background' : 'bg-muted/20')}>
                  <td className="px-4 py-3 font-mono">{d.reservation_id.substring(0, 8)}</td>
                  <td className="px-4 py-3 capitalize">{d.type}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(d.scheduled_at)}</td>
                  <td className="px-4 py-3 truncate max-w-[200px]">{d.address}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => void deleteMutation.mutateAsync(d.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Página {page} de {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setFilters(f => ({ ...f, page: Math.max(1, page - 1) }))} disabled={page <= 1} className="p-1.5 hover:bg-accent disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, page + 1) }))} disabled={page >= totalPages} className="p-1.5 hover:bg-accent disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
      <DeliveryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
