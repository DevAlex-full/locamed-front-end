import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { z } from 'zod'
import {
  Calendar,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Ban,
  CheckCircle,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/shared/hooks/useAuth'
import { UserRoles } from '@/shared/types'
import { useClients } from '@/modules/clients/hooks/useClients'
import { useChairs } from '@/modules/chairs/hooks/useChairs'
import { CHAIR_STATUS } from '@/modules/chairs/api/chairs'
import {
  useReservations,
  useCreateReservation,
  useUpdateReservationStatus,
  useDeleteReservation,
  getApiErrorMessage,
} from '../hooks/useReservations'
import {
  RESERVATION_STATUS,
  RESERVATION_STATUS_LABEL,
  RESERVATION_STATUS_COLOR,
  STATUS_TRANSITIONS,
  type ReservationDto,
  type ReservationStatus,
  type CreateReservationData,
  type ReservationsFilters,
} from '../api/reservations'

// =============================================================================
// ReservationsPage — Módulo de Reservas (Etapa 12)
// =============================================================================
//
// Layout:
//   Header: titulo + contador + botao "Nova Reserva"
//   Filtro: select de status
//   Tabela: Cliente, Poltrona, Periodo, Dias, Valor, Status, Acoes
//   Modal:  formulario de criacao (cliente + poltrona + datas + diaria)
//   Dialog: confirmacao de cancelamento / exclusao
// =============================================================================

// ── Schema do formulário ─────────────────────────────────────────────────────
const reservationFormSchema = z
  .object({
    clientId:      z.string().uuid('Selecione um cliente'),
    chairId:       z.string().uuid('Selecione uma poltrona'),
    startDate:     z.string().min(1, 'Data de inicio obrigatoria'),
    endDate:       z.string().min(1, 'Data de termino obrigatoria'),
    dailyRate:     z.string().min(1, 'Valor da diaria obrigatorio'),
    discount:      z.string().optional(),
    paymentMethod: z.string().optional(),
    notes:         z.string().optional(),
  })
  .refine(
    (d) => !d.startDate || !d.endDate || d.endDate >= d.startDate,
    { message: 'Data de termino deve ser igual ou posterior a data de inicio', path: ['endDate'] },
  )

type ReservationFormData = z.infer<typeof reservationFormSchema>

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function formatCurrency(value: string | null | undefined): string {
  if (!value) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style:    'currency',
    currency: 'BRL',
  }).format(parseFloat(value))
}

function calcPreview(
  startDate: string,
  endDate:   string,
  dailyRate: string,
  discount:  string,
): { days: number; total: number; final: number } | null {
  if (!startDate || !endDate || !dailyRate) return null
  const start = new Date(startDate)
  const end   = new Date(endDate)
  if (end < start) return null
  const days  = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1
  const rate  = parseFloat(dailyRate) || 0
  const disc  = parseFloat(discount  || '0') || 0
  const total = rate * days
  return { days, total, final: Math.max(0, total - disc) }
}

// ── Badge de status ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        RESERVATION_STATUS_COLOR[status],
      )}
    >
      {RESERVATION_STATUS_LABEL[status]}
    </span>
  )
}

// ── Modal de criação ──────────────────────────────────────────────────────────
function ReservationModal({
  open,
  onClose,
}: {
  open:    boolean
  onClose: () => void
}) {
  const createMutation = useCreateReservation()
  const [serverError, setServerError] = useState<string | null>(null)

  // Carregar clientes e poltronas disponíveis
  const { data: clientsData } = useClients({ limit: 100 })
  const { data: chairsData }  = useChairs({
    status: CHAIR_STATUS.available,
    limit:  100,
  })

  const clients = clientsData?.data ?? []
  const chairs  = chairsData?.data  ?? []

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver:      zodResolver(reservationFormSchema),
    defaultValues: { discount: '0' },
  })

  // Reset ao abrir/fechar
  useEffect(() => {
    if (open) {
      reset({ discount: '0' })
      setServerError(null)
    }
  }, [open, reset])

  const watchedValues = watch(['startDate', 'endDate', 'dailyRate', 'discount'])
  const preview = calcPreview(
    watchedValues[0] ?? '',
    watchedValues[1] ?? '',
    watchedValues[2] ?? '',
    watchedValues[3] ?? '',
  )

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) { reset({ discount: '0' }); setServerError(null); onClose() }
  }

  const onSubmit = async (form: ReservationFormData) => {
    setServerError(null)
    try {
      const payload: CreateReservationData = {
        clientId:      form.clientId,
        chairId:       form.chairId,
        startDate:     form.startDate,
        endDate:       form.endDate,
        dailyRate:     parseFloat(form.dailyRate),
        discount:      parseFloat(form.discount || '0') || 0,
        paymentMethod: form.paymentMethod || null,
        notes:         form.notes || null,
      }
      await createMutation.mutateAsync(payload)
      reset({ discount: '0' })
      onClose()
    } catch (err) {
      setServerError(getApiErrorMessage(err))
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-xl max-h-[90vh] overflow-y-auto',
            'rounded-xl border bg-background shadow-xl p-6',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-lg font-semibold">Nova Reserva</Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent transition-colors"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {serverError && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          <form
            onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}
            noValidate
            className="space-y-4"
          >
            {/* Cliente */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">Cliente *</label>
              <select
                {...register('clientId')}
                className={cn(
                  'w-full rounded-md border px-3 py-2 text-sm bg-background',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  errors.clientId ? 'border-destructive' : 'border-input',
                )}
              >
                <option value="">Selecione o cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.clientId && (
                <p className="text-xs text-destructive">{errors.clientId.message}</p>
              )}
            </div>

            {/* Poltrona */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">Poltrona disponivel *</label>
              <select
                {...register('chairId')}
                className={cn(
                  'w-full rounded-md border px-3 py-2 text-sm bg-background',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  errors.chairId ? 'border-destructive' : 'border-input',
                )}
              >
                <option value="">Selecione a poltrona...</option>
                {chairs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}{c.model ? ` — ${c.model}` : ''}
                  </option>
                ))}
              </select>
              {chairs.length === 0 && (
                <p className="text-xs text-amber-600">
                  Nenhuma poltrona disponivel no momento.
                </p>
              )}
              {errors.chairId && (
                <p className="text-xs text-destructive">{errors.chairId.message}</p>
              )}
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">Data de inicio *</label>
                <input
                  {...register('startDate')}
                  type="date"
                  className={cn(
                    'w-full rounded-md border px-3 py-2 text-sm bg-background',
                    'focus:outline-none focus:ring-2 focus:ring-ring',
                    errors.startDate ? 'border-destructive' : 'border-input',
                  )}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">Data de termino *</label>
                <input
                  {...register('endDate')}
                  type="date"
                  className={cn(
                    'w-full rounded-md border px-3 py-2 text-sm bg-background',
                    'focus:outline-none focus:ring-2 focus:ring-ring',
                    errors.endDate ? 'border-destructive' : 'border-input',
                  )}
                />
                {errors.endDate && (
                  <p className="text-xs text-destructive">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Valores */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">Diaria (R$) *</label>
                <input
                  {...register('dailyRate')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className={cn(
                    'w-full rounded-md border px-3 py-2 text-sm bg-background',
                    'focus:outline-none focus:ring-2 focus:ring-ring',
                    errors.dailyRate ? 'border-destructive' : 'border-input',
                  )}
                />
                {errors.dailyRate && (
                  <p className="text-xs text-destructive">{errors.dailyRate.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">Desconto (R$)</label>
                <input
                  {...register('discount')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Preview de valores */}
            {preview && (
              <div className="rounded-lg bg-muted/50 border p-3 text-sm space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Periodo:</span>
                  <span className="font-medium text-foreground">{preview.days} dia{preview.days !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total:</span>
                  <span>{formatCurrency(String(preview.total))}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Valor final:</span>
                  <span className="text-primary">{formatCurrency(String(preview.final))}</span>
                </div>
              </div>
            )}

            {/* Forma de pagamento e observacoes */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">Forma de pagamento</label>
              <input
                {...register('paymentMethod')}
                placeholder="Pix, dinheiro, cartao..."
                className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">Observacoes</label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Informacoes adicionais..."
                className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-md px-4 py-2 text-sm border hover:bg-accent transition-colors"
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className={cn(
                  'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium',
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                  'disabled:opacity-60 disabled:cursor-not-allowed transition-colors',
                )}
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Criar reserva
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export function ReservationsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === UserRoles.ADMIN || user?.role === UserRoles.SUPER_ADMIN

  const [filters,        setFilters]        = useState<ReservationsFilters>({ page: 1 })
  const [modalOpen,      setModalOpen]      = useState(false)
  const [cancelTarget,   setCancelTarget]   = useState<ReservationDto | null>(null)
  const [confirmTarget,  setConfirmTarget]  = useState<{reservation: ReservationDto, status: ReservationStatus} | null>(null)

  const { data, isLoading, isError } = useReservations(filters)
  const updateStatus  = useUpdateReservationStatus()
  const deleteMutation = useDeleteReservation()

  const reservations = data?.data ?? []
  const meta         = data?.meta
  const totalPages   = meta?.totalPages ?? 1
  const page         = filters.page ?? 1

  async function handleStatusUpdate() {
    if (!confirmTarget) return
    const { reservation, status } = confirmTarget
    try {
      await updateStatus.mutateAsync({
        id:     reservation.id,
        status: status,
      })
    } finally {
      setConfirmTarget(null)
    }
  }

  async function handleCancel() {
    if (!cancelTarget) return
    try {
      await updateStatus.mutateAsync({
        id:     cancelTarget.id,
        status: RESERVATION_STATUS.cancelled,
      })
    } finally {
      setCancelTarget(null)
    }
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reservas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {meta
              ? `${meta.total} reserva${meta.total !== 1 ? 's' : ''}`
              : 'Carregando...'}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova Reserva
        </button>
      </div>

      {/* Filtro de status */}
      <div className="flex gap-2">
        <select
          value={filters.status ?? ''}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status: e.target.value ? (e.target.value as ReservationStatus) : undefined,
              page:   1,
            }))
          }
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todos os status</option>
          {Object.entries(RESERVATION_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left font-medium px-4 py-3 text-muted-foreground">Cliente</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground hidden sm:table-cell">Poltrona</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground hidden md:table-cell">Periodo</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground hidden lg:table-cell">Valor</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground">Status</th>
              <th className="text-right font-medium px-4 py-3 text-muted-foreground">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                  Carregando reservas...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-destructive">
                  Erro ao carregar reservas. Tente novamente.
                </td>
              </tr>
            )}
            {!isLoading && !isError && reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    Nenhuma reserva encontrada.
                  </p>
                </td>
              </tr>
            )}
            {reservations.map((r, idx) => {
              const transitions = STATUS_TRANSITIONS[r.status] ?? []
              const canConfirm  = transitions.includes(RESERVATION_STATUS.confirmed)
              const canActivate = transitions.includes(RESERVATION_STATUS.active)
              const canComplete = transitions.includes(RESERVATION_STATUS.completed)
              const canCancel   = transitions.includes(RESERVATION_STATUS.cancelled)

              return (
                <tr
                  key={r.id}
                  className={cn(
                    'border-b last:border-0',
                    idx % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                  )}
                >
                  <td className="px-4 py-3 font-medium">
                    {r.clientName ?? r.clientId.substring(0, 8)}
                  </td>
                  <td className="px-4 py-3 font-mono hidden sm:table-cell">
                    {r.chairCode ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                    {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    <span className="ml-1 text-muted-foreground/60">({r.totalDays}d)</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {formatCurrency(r.finalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {canConfirm && (
                        <button
                          onClick={() => setConfirmTarget({ reservation: r, status: RESERVATION_STATUS.confirmed })}
                          className="rounded-md p-1.5 text-muted-foreground hover:text-green-600 hover:bg-green-50 transition-colors"
                          aria-label="Confirmar reserva"
                          title="Confirmar"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {canActivate && (
                        <button
                          onClick={() => setConfirmTarget({ reservation: r, status: RESERVATION_STATUS.active })}
                          className="rounded-md p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          aria-label="Ativar reserva"
                          title="Ativar"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {canComplete && (
                        <button
                          onClick={() => setConfirmTarget({ reservation: r, status: RESERVATION_STATUS.completed })}
                          className="rounded-md p-1.5 text-muted-foreground hover:text-gray-600 hover:bg-gray-50 transition-colors"
                          aria-label="Concluir reserva"
                          title="Concluir"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => setCancelTarget(r)}
                          className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label="Cancelar reserva"
                          title="Cancelar"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                      {isAdmin && r.status === RESERVATION_STATUS.pending && (
                        <button
                          onClick={() => void deleteMutation.mutateAsync(r.id)}
                          disabled={deleteMutation.isPending}
                          className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-40 transition-colors"
                          aria-label="Excluir reserva"
                          title="Excluir (somente pendentes)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Pagina {meta.page} de {meta.totalPages} ({meta.total} registros)</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, page - 1) }))}
              disabled={page <= 1}
              className="rounded-md p-1.5 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setFilters((f) => ({ ...f, page: Math.min(totalPages, page + 1) }))}
              disabled={page >= totalPages}
              className="rounded-md p-1.5 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal nova reserva */}
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Confirmar reserva */}
      <Dialog.Root
        open={confirmTarget !== null}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null) }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-xl border bg-background p-6 shadow-xl">
            <Dialog.Title className="text-base font-semibold mb-2">
              Atualizar status da reserva?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mb-5">
              A reserva de <strong>{confirmTarget?.reservation.clientName}</strong> sera alterada para <strong className="capitalize">{confirmTarget?.status}</strong>.
            </Dialog.Description>
            <div className="flex gap-3 justify-end">
              <Dialog.Close asChild>
                <button className="rounded-md px-4 py-2 text-sm border hover:bg-accent transition-colors">
                  Voltar
                </button>
              </Dialog.Close>
              <button
                onClick={() => void handleStatusUpdate()}
                disabled={updateStatus.isPending}
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {updateStatus.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirmar
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Cancelar reserva */}
      <Dialog.Root
        open={cancelTarget !== null}
        onOpenChange={(open) => { if (!open) setCancelTarget(null) }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-xl border bg-background p-6 shadow-xl">
            <Dialog.Title className="text-base font-semibold mb-2">
              Cancelar reserva?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mb-5">
              A reserva de <strong>{cancelTarget?.clientName}</strong> sera cancelada
              e a poltrona <strong>{cancelTarget?.chairCode}</strong> voltara a ficar disponivel.
            </Dialog.Description>
            <div className="flex gap-3 justify-end">
              <Dialog.Close asChild>
                <button className="rounded-md px-4 py-2 text-sm border hover:bg-accent transition-colors">
                  Voltar
                </button>
              </Dialog.Close>
              <button
                onClick={() => void handleCancel()}
                disabled={updateStatus.isPending}
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60 transition-colors"
              >
                {updateStatus.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Cancelar reserva
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  )
}