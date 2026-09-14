import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { z } from 'zod'
import {
  Armchair,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/shared/hooks/useAuth'
import { UserRoles } from '@/shared/types'
import {
  useChairs,
  useCreateChair,
  useUpdateChair,
  useDeleteChair,
  getApiErrorMessage,
} from '../hooks/useChairs'
import {
  CHAIR_STATUS,
  CHAIR_STATUS_LABEL,
  CHAIR_STATUS_COLOR,
  MANUAL_STATUSES,
  type ChairDto,
  type ChairStatus,
  type CreateChairData,
  type UpdateChairData,
  type ChairsFilters,
} from '../api/chairs'

// =============================================================================
// ChairsPage — CRUD completo de Poltronas
// =============================================================================
//
// Layout:
//   Header: titulo + contador + botao "Nova Poltrona"
//   Filtros: busca (codigo/modelo/fabricante) + select de status
//   Tabela:  Codigo, Patrimonio, Modelo, Fabricante, Status (badge), Acoes
//   Paginacao
//   Modal:   formulario de criacao e edicao
//   Dialog:  confirmacao de exclusao
// =============================================================================

// ── Schema Zod do formulario ──────────────────────────────────────────────────
const chairFormSchema = z.object({
  code:             z.string().trim().min(1, 'Codigo obrigatorio').max(50).toUpperCase(),
  patrimonyNumber:  z.string().trim().optional(),
  model:            z.string().trim().optional(),
  manufacturer:     z.string().trim().optional(),
  acquisitionDate:  z.string().optional(),
  acquisitionValue: z.string().optional(),  // input numerico como string, convertido no submit
  status:           z.enum([
    CHAIR_STATUS.available,
    CHAIR_STATUS.maintenance,
    CHAIR_STATUS.sanitization,
    CHAIR_STATUS.inactive,
  ]),
  notes: z.string().trim().optional(),
})

type ChairFormData = z.infer<typeof chairFormSchema>

// ── Helpers ───────────────────────────────────────────────────────────────────
function emptyToNull(val: string | undefined): string | null {
  if (val === undefined || val.trim() === '') return null
  return val.trim()
}

function chairToFormData(chair: ChairDto): ChairFormData {
  const safeStatus = MANUAL_STATUSES.includes(chair.status as ChairStatus)
    ? (chair.status as ChairFormData['status'])
    : CHAIR_STATUS.available

  return {
    code:             chair.code,
    patrimonyNumber:  chair.patrimonyNumber ?? '',
    model:            chair.model ?? '',
    manufacturer:     chair.manufacturer ?? '',
    acquisitionDate:  chair.acquisitionDate ?? '',
    acquisitionValue: chair.acquisitionValue ?? '',
    status:           safeStatus,
    notes:            chair.notes ?? '',
  }
}

// ── Badge de status ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ChairStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        CHAIR_STATUS_COLOR[status],
      )}
    >
      {CHAIR_STATUS_LABEL[status]}
    </span>
  )
}

// ── Componentes de formulario ─────────────────────────────────────────────────
function FieldGroup({
  label,
  error,
  children,
}: {
  label:    string
  error?:   string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function Input({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      className={cn(
        'w-full rounded-md border px-3 py-2 text-sm bg-background',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error ? 'border-destructive' : 'border-input',
        className,
      )}
      {...props}
    />
  )
}

// ── Modal de criacao / edicao ─────────────────────────────────────────────────
function ChairModal({
  open,
  editing,
  onClose,
}: {
  open:    boolean
  editing: ChairDto | null
  onClose: () => void
}) {
  const createMutation = useCreateChair()
  const updateMutation = useUpdateChair()
  const [serverError, setServerError] = useState<string | null>(null)
  const isEditing  = editing !== null
  const isPending  = createMutation.isPending || updateMutation.isPending

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ChairFormData>({
      resolver:      zodResolver(chairFormSchema),
      defaultValues: isEditing
        ? chairToFormData(editing)
        : { status: CHAIR_STATUS.available },
    })

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) { reset(); setServerError(null); onClose() }
  }

  const onSubmit = async (form: ChairFormData) => {
    setServerError(null)
    try {
      const acquisitionValue = form.acquisitionValue
        ? parseFloat(form.acquisitionValue)
        : null

      if (isEditing) {
        const payload: UpdateChairData = {
          code:             form.code,
          patrimonyNumber:  emptyToNull(form.patrimonyNumber),
          model:            emptyToNull(form.model),
          manufacturer:     emptyToNull(form.manufacturer),
          acquisitionDate:  emptyToNull(form.acquisitionDate) ?? undefined,
          acquisitionValue: isNaN(acquisitionValue ?? NaN) ? null : acquisitionValue,
          status:           form.status,
          notes:            emptyToNull(form.notes),
        }
        await updateMutation.mutateAsync({ id: editing.id, data: payload })
      } else {
        const payload: CreateChairData = {
          code:             form.code,
          patrimonyNumber:  emptyToNull(form.patrimonyNumber),
          model:            emptyToNull(form.model),
          manufacturer:     emptyToNull(form.manufacturer),
          acquisitionDate:  emptyToNull(form.acquisitionDate) ?? undefined,
          acquisitionValue: isNaN(acquisitionValue ?? NaN) ? null : acquisitionValue,
          status:           form.status,
          notes:            emptyToNull(form.notes),
        }
        await createMutation.mutateAsync(payload)
      }
      reset()
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
            <Dialog.Title className="text-lg font-semibold">
              {isEditing ? 'Editar Poltrona' : 'Nova Poltrona'}
            </Dialog.Title>
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
            className="space-y-5"
          >
            {/* Identificacao */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Identificacao
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldGroup label="Codigo *" error={errors.code?.message}>
                  <Input
                    {...register('code')}
                    placeholder="POL-001"
                    error={errors.code?.message}
                    className="uppercase"
                  />
                </FieldGroup>
                <FieldGroup label="Numero de Patrimonio">
                  <Input {...register('patrimonyNumber')} placeholder="PAT-00001" />
                </FieldGroup>
                <FieldGroup label="Modelo">
                  <Input {...register('model')} placeholder="Modelo da poltrona" />
                </FieldGroup>
                <FieldGroup label="Fabricante">
                  <Input {...register('manufacturer')} placeholder="Fabricante" />
                </FieldGroup>
              </div>
            </div>

            {/* Status e aquisicao */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Status e Aquisicao
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FieldGroup label="Status" error={errors.status?.message}>
                  <select
                    {...register('status')}
                    className={cn(
                      'w-full rounded-md border border-input px-3 py-2 text-sm bg-background',
                      'focus:outline-none focus:ring-2 focus:ring-ring',
                    )}
                  >
                    {MANUAL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {CHAIR_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </FieldGroup>
                <FieldGroup label="Data de Aquisicao">
                  <Input {...register('acquisitionDate')} type="date" />
                </FieldGroup>
                <FieldGroup label="Valor de Aquisicao (R$)">
                  <Input
                    {...register('acquisitionValue')}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                  />
                </FieldGroup>
              </div>
            </div>

            {/* Observacoes */}
            <FieldGroup label="Observacoes">
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Informacoes adicionais sobre a poltrona..."
                className={cn(
                  'w-full rounded-md border border-input px-3 py-2 text-sm bg-background resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                )}
              />
            </FieldGroup>

            <div className="flex items-center justify-end gap-3 pt-2 border-t">
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
                disabled={isPending}
                className={cn(
                  'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium',
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                  'disabled:opacity-60 disabled:cursor-not-allowed transition-colors',
                )}
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? 'Salvar alteracoes' : 'Criar poltrona'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ── Pagina principal ──────────────────────────────────────────────────────────
export function ChairsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === UserRoles.ADMIN || user?.role === UserRoles.SUPER_ADMIN

  const [searchInput,   setSearchInput]   = useState('')
  const [filters,       setFilters]       = useState<ChairsFilters>({ page: 1 })
  const [modalOpen,     setModalOpen]     = useState(false)
  const [editingChair,  setEditingChair]  = useState<ChairDto | null>(null)
  const [deleteTarget,  setDeleteTarget]  = useState<ChairDto | null>(null)

  const { data, isLoading, isError } = useChairs(filters)
  const deleteMutation = useDeleteChair()

  const chairs     = data?.data ?? []
  const meta       = data?.meta
  const totalPages = meta?.totalPages ?? 1
  const page       = filters.page ?? 1

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setFilters((f) => ({ ...f, search: searchInput || undefined, page: 1 }))
  }

  function handleStatusFilter(status: string) {
    setFilters((f) => ({
      ...f,
      status: status ? (status as ChairStatus) : undefined,
      page: 1,
    }))
  }

  function openCreate() {
    setEditingChair(null)
    setModalOpen(true)
  }

  function openEdit(chair: ChairDto) {
    setEditingChair(chair)
    setModalOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Poltronas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {meta
              ? `${meta.total} poltrona${meta.total !== 1 ? 's' : ''} cadastrada${meta.total !== 1 ? 's' : ''}`
              : 'Carregando...'}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova Poltrona
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por codigo, modelo ou fabricante..."
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            Buscar
          </button>
          {(filters.search) && (
            <button
              type="button"
              onClick={() => { setSearchInput(''); setFilters((f) => ({ ...f, search: undefined, page: 1 })) }}
              className="rounded-md border px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
            >
              Limpar
            </button>
          )}
        </form>

        {/* Filtro de status */}
        <select
          value={filters.status ?? ''}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todos os status</option>
          {Object.entries(CHAIR_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left font-medium px-4 py-3 text-muted-foreground">Codigo</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground hidden md:table-cell">Patrimonio</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground hidden sm:table-cell">Modelo</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground hidden lg:table-cell">Fabricante</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground">Status</th>
              <th className="text-right font-medium px-4 py-3 text-muted-foreground">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                  Carregando poltronas...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-destructive">
                  Erro ao carregar poltronas. Tente novamente.
                </td>
              </tr>
            )}
            {!isLoading && !isError && chairs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Armchair className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    {filters.search || filters.status
                      ? 'Nenhuma poltrona encontrada para este filtro.'
                      : 'Nenhuma poltrona cadastrada ainda.'}
                  </p>
                </td>
              </tr>
            )}
            {chairs.map((chair, idx) => (
              <tr
                key={chair.id}
                className={cn(
                  'border-b last:border-0',
                  idx % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                )}
              >
                <td className="px-4 py-3 font-mono font-medium">{chair.code}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {chair.patrimonyNumber ?? '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {chair.model ?? '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                  {chair.manufacturer ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={chair.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(chair)}
                      className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      aria-label="Editar poltrona"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => setDeleteTarget(chair)}
                        className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label="Remover poltrona"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginacao */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Pagina {meta.page} de {meta.totalPages} ({meta.total} registros)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, page - 1) }))}
              disabled={page <= 1}
              className="rounded-md p-1.5 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Pagina anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setFilters((f) => ({ ...f, page: Math.min(totalPages, page + 1) }))}
              disabled={page >= totalPages}
              className="rounded-md p-1.5 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Proxima pagina"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal criar/editar */}
      <ChairModal
        open={modalOpen}
        editing={editingChair}
        onClose={() => setModalOpen(false)}
      />

      {/* Dialog de confirmacao de exclusao */}
      <Dialog.Root
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
              'w-full max-w-sm rounded-xl border bg-background p-6 shadow-xl',
            )}
          >
            <Dialog.Title className="text-base font-semibold mb-2">
              Remover poltrona?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mb-5">
              A poltrona <strong>{deleteTarget?.code}</strong> sera removida do sistema.
              O historico de reservas associado sera preservado.
            </Dialog.Description>
            <div className="flex gap-3 justify-end">
              <Dialog.Close asChild>
                <button className="rounded-md px-4 py-2 text-sm border hover:bg-accent transition-colors">
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                onClick={() => void confirmDelete()}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60 transition-colors"
              >
                {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Remover
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}