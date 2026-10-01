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
  useChairBlocks, 
  useCreateChairBlock, 
  useDeleteChairBlock, 
  getApiErrorMessage 
} from '../hooks/useChairBlocks'
import { 
  CHAIR_BLOCK_TYPE, 
  CHAIR_BLOCK_TYPE_LABEL, 
  type ChairBlockType, 
  type ChairBlockFilters 
} from '../api/chair_blocks'
import { useChairs } from '@/modules/chairs/hooks/useChairs'
import { CHAIR_STATUS } from '@/modules/chairs/api/chairs'

const chairBlockFormSchema = z.object({
  chairId:   z.string().uuid('Selecione uma poltrona'),
  type:      z.string().min(1, 'Tipo de bloqueio obrigatorio'),
  reason:    z.string().min(3, 'Motivo deve ter pelo menos 3 caracteres'),
  startDate: z.string().min(1, 'Data de inicio obrigatoria'),
  endDate:   z.string().min(1, 'Data de termino obrigatoria'),
  notes:     z.string().optional(),
}).refine(
  (d) => !d.startDate || !d.endDate || d.endDate >= d.startDate,
  { message: 'Data de termino deve ser igual ou posterior a data de inicio', path: ['endDate'] },
)

type ChairBlockFormData = z.infer<typeof chairBlockFormSchema>

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

function ChairBlockModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createMutation = useCreateChairBlock()
  const [serverError, setServerError] = useState<string | null>(null)
  
  const { data: chairsData } = useChairs({
    status: CHAIR_STATUS.available,
    limit: 100,
  })
  const chairs = chairsData?.data ?? []

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChairBlockFormData>({
    resolver: zodResolver(chairBlockFormSchema),
  })

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) { reset(); setServerError(null); onClose() }
  }

  const onSubmit = async (form: ChairBlockFormData) => {
    setServerError(null)
    try {
      await createMutation.mutateAsync({
        chairId: form.chairId,
        type: form.type as ChairBlockType,
        reason: form.reason,
        startDate: form.startDate,
        endDate: form.endDate,
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
            <Dialog.Title className="text-lg font-semibold">Bloquear Poltrona</Dialog.Title>
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
              <label className="block text-xs font-medium">Poltrona *</label>
              <select {...register('chairId')} className={cn('w-full rounded-md border px-3 py-2 text-sm bg-background', errors.chairId && 'border-destructive')}>
                <option value="">Selecione...</option>
                {chairs.map(c => <option key={c.id} value={c.id}>{c.code} {c.model && `— ${c.model}`}</option>)}
              </select>
              {errors.chairId && <p className="text-xs text-destructive">{errors.chairId.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium">Tipo *</label>
              <select {...register('type')} className={cn('w-full rounded-md border px-3 py-2 text-sm bg-background', errors.type && 'border-destructive')}>
                <option value="">Selecione...</option>
                {Object.entries(CHAIR_BLOCK_TYPE).map(([_, val]) => (
                  <option key={val} value={val}>{CHAIR_BLOCK_TYPE_LABEL[val as ChairBlockType]}</option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium">Motivo *</label>
              <input {...register('reason')} className={cn('w-full rounded-md border px-3 py-2 text-sm bg-background', errors.reason && 'border-destructive')} />
              {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium">Início *</label>
                <input type="date" {...register('startDate')} className={cn('w-full rounded-md border px-3 py-2 text-sm bg-background', errors.startDate && 'border-destructive')} />
                {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium">Término *</label>
                <input type="date" {...register('endDate')} className={cn('w-full rounded-md border px-3 py-2 text-sm bg-background', errors.endDate && 'border-destructive')} />
                {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium">Notas</label>
              <textarea {...register('notes')} rows={2} className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t">
              <Dialog.Close asChild>
                <button type="button" className="rounded-md px-4 py-2 text-sm border hover:bg-accent">Cancelar</button>
              </Dialog.Close>
              <button type="submit" disabled={createMutation.isPending} className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Bloquear
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function ChairBlocksPage() {
  const [filters, setFilters] = useState<ChairBlockFilters>({ page: 1 })
  const [modalOpen, setModalOpen] = useState(false)
  const { data, isLoading, isError } = useChairBlocks(filters)
  const deleteMutation = useDeleteChairBlock()

  const blocks = data?.data ?? []
  const meta = data?.meta
  const page = filters.page ?? 1
  const totalPages = meta?.totalPages ?? 1

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Bloqueios de Poltronas</h1>
          <p className="text-sm text-muted-foreground">{meta ? `${meta.total} bloqueios registrados` : 'Carregando...'}</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Novo Bloqueio
        </button>
      </div>
      <div className="flex gap-2">
        <select 
          value={filters.type ?? ''} 
          onChange={(e) => setFilters(f => ({ ...f, type: e.target.value as ChairBlockType || undefined, page: 1 }))}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos os tipos</option>
          {Object.entries(CHAIR_BLOCK_TYPE).map(([_, val]) => (
            <option key={val} value={val}>{CHAIR_BLOCK_TYPE_LABEL[val as ChairBlockType]}</option>
          ))}
        </select>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Poltrona</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Período</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Motivo</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-12"><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />Carregando...</td></tr>
            ) : isError ? (
              <tr><td colSpan={5} className="text-center py-12 text-destructive">Erro ao carregar bloqueios.</td></tr>
            ) : blocks.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Nenhum bloqueio encontrado.</td></tr>
            ) : (
              blocks.map((b, i) => (
                <tr key={b.id} className={cn('border-b last:border-0', i % 2 === 0 ? 'bg-background' : 'bg-muted/20')}>
                  <td className="px-4 py-3 font-mono">{b.chairCode ?? '—'}</td>
                  <td className="px-4 py-3">{CHAIR_BLOCK_TYPE_LABEL[b.type as ChairBlockType]}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(b.start_date)} → {formatDate(b.end_date)}</td>
                  <td className="px-4 py-3">{b.reason}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => void deleteMutation.mutateAsync(b.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
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
      <ChairBlockModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
