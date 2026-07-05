import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { z } from 'zod'
import {
  Users,
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
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  getApiErrorMessage,
} from '../hooks/useClients'
import type { ClientDto, CreateClientData, UpdateClientData } from '../api/clients'

// =============================================================================
// ClientsPage — CRUD completo de Clientes
// =============================================================================
//
// Layout:
//   Header: titulo + contador + botao "Novo Cliente"
//   Filtros: campo de busca (nome, CPF, telefone) + botao buscar
//   Tabela:  Nome, CPF, Telefone, Cidade, Data Cirurgia, Acoes
//   Paginacao: anterior / pagina X de Y / proximo
//   Modal:   formulario de criacao e edicao (Radix Dialog)
//
// Permissoes:
//   Criar/Editar: admin, super_admin, operator
//   Deletar:      admin, super_admin
// =============================================================================

// ── Schema de validacao do formulario ────────────────────────────────────────
const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/

const clientFormSchema = z.object({
  name:         z.string().trim().min(2, 'Nome obrigatorio (min 2 caracteres)'),
  cpf:          z.string().regex(cpfRegex, 'CPF invalido (ex: 000.000.000-00)'),
  phone:        z.string().trim().min(10, 'Telefone obrigatorio'),
  email:        z.string().trim().email('E-mail invalido').or(z.literal('')).optional(),
  whatsapp:     z.string().trim().optional(),
  birthDate:    z.string().optional(),
  doctor:       z.string().trim().optional(),
  hospital:     z.string().trim().optional(),
  surgeryDate:  z.string().optional(),
  zipCode:      z.string().trim().optional(),
  address:      z.string().trim().optional(),
  number:       z.string().trim().optional(),
  complement:   z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  city:         z.string().trim().optional(),
  state:        z.string().trim().max(2).toUpperCase().optional(),
  notes:        z.string().trim().optional(),
})

type ClientFormData = z.infer<typeof clientFormSchema>

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return cpf
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function emptyToNull(val: string | undefined): string | null {
  if (val === undefined || val.trim() === '') return null
  return val.trim()
}

function clientToFormData(client: ClientDto): ClientFormData {
  return {
    name:         client.name,
    cpf:          client.cpf,
    phone:        client.phone,
    email:        client.email ?? '',
    whatsapp:     client.whatsapp ?? '',
    birthDate:    client.birthDate ?? '',
    doctor:       client.doctor ?? '',
    hospital:     client.hospital ?? '',
    surgeryDate:  client.surgeryDate ?? '',
    zipCode:      client.zipCode ?? '',
    address:      client.address ?? '',
    number:       client.number ?? '',
    complement:   client.complement ?? '',
    neighborhood: client.neighborhood ?? '',
    city:         client.city ?? '',
    state:        client.state ?? '',
    notes:        client.notes ?? '',
  }
}

// ── Componentes internos ──────────────────────────────────────────────────────

function FieldGroup({ label, error, children }: {
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

function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      className={cn(
        'w-full rounded-md border px-3 py-2 text-sm bg-background',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error ? 'border-destructive' : 'border-input',
      )}
      {...props}
    />
  )
}

// ── Modal de Criacao / Edicao ─────────────────────────────────────────────────
interface ClientModalProps {
  open:     boolean
  editing:  ClientDto | null
  onClose:  () => void
}

function ClientModal({ open, editing, onClose }: ClientModalProps) {
  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const isEditing = editing !== null
  const isPending = createMutation.isPending || updateMutation.isPending

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormData>({
    resolver:      zodResolver(clientFormSchema),
    defaultValues: isEditing ? clientToFormData(editing) : {},
  })

  // Reset quando o modal abre/fecha ou muda de modo
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset()
      setServerError(null)
      onClose()
    }
  }

  const onSubmit = async (form: ClientFormData) => {
    setServerError(null)
    try {
      if (isEditing) {
        const payload: UpdateClientData = {
          name:         form.name,
          cpf:          form.cpf,
          phone:        form.phone,
          email:        emptyToNull(form.email),
          whatsapp:     emptyToNull(form.whatsapp),
          birthDate:    emptyToNull(form.birthDate) ?? undefined,
          doctor:       emptyToNull(form.doctor),
          hospital:     emptyToNull(form.hospital),
          surgeryDate:  emptyToNull(form.surgeryDate) ?? undefined,
          zipCode:      emptyToNull(form.zipCode),
          address:      emptyToNull(form.address),
          number:       emptyToNull(form.number),
          complement:   emptyToNull(form.complement),
          neighborhood: emptyToNull(form.neighborhood),
          city:         emptyToNull(form.city),
          state:        emptyToNull(form.state),
          notes:        emptyToNull(form.notes),
        }
        await updateMutation.mutateAsync({ id: editing.id, data: payload })
      } else {
        const payload: CreateClientData = {
          name:         form.name,
          cpf:          form.cpf,
          phone:        form.phone,
          email:        emptyToNull(form.email),
          whatsapp:     emptyToNull(form.whatsapp),
          birthDate:    emptyToNull(form.birthDate) ?? undefined,
          doctor:       emptyToNull(form.doctor),
          hospital:     emptyToNull(form.hospital),
          surgeryDate:  emptyToNull(form.surgeryDate) ?? undefined,
          zipCode:      emptyToNull(form.zipCode),
          address:      emptyToNull(form.address),
          number:       emptyToNull(form.number),
          complement:   emptyToNull(form.complement),
          neighborhood: emptyToNull(form.neighborhood),
          city:         emptyToNull(form.city),
          state:        emptyToNull(form.state),
          notes:        emptyToNull(form.notes),
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
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Conteudo */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-2xl max-h-[90vh] overflow-y-auto',
            'rounded-xl border bg-background shadow-xl p-6',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-lg font-semibold">
              {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
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

          {/* Erro do servidor */}
          {serverError && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          {/* Formulario */}
          <form
            onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}
            noValidate
            className="space-y-5"
          >
            {/* Dados principais */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Dados Principais
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <FieldGroup label="Nome completo *" error={errors.name?.message}>
                    <Input {...register('name')} placeholder="Maria da Silva" error={errors.name?.message} />
                  </FieldGroup>
                </div>
                <FieldGroup label="CPF *" error={errors.cpf?.message}>
                  <Input {...register('cpf')} placeholder="000.000.000-00" error={errors.cpf?.message} />
                </FieldGroup>
                <FieldGroup label="RG">
                  <Input {...register('whatsapp')} placeholder="0.000.000" />
                </FieldGroup>
                <FieldGroup label="Telefone *" error={errors.phone?.message}>
                  <Input {...register('phone')} placeholder="(11) 99999-9999" error={errors.phone?.message} />
                </FieldGroup>
                <FieldGroup label="WhatsApp">
                  <Input {...register('whatsapp')} placeholder="(11) 99999-9999" />
                </FieldGroup>
                <FieldGroup label="E-mail" error={errors.email?.message}>
                  <Input {...register('email')} type="email" placeholder="maria@email.com" error={errors.email?.message} />
                </FieldGroup>
                <FieldGroup label="Data de Nascimento">
                  <Input {...register('birthDate')} type="date" />
                </FieldGroup>
              </div>
            </div>

            {/* Dados medicos */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Informacoes Medicas
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldGroup label="Medico responsavel">
                  <Input {...register('doctor')} placeholder="Dr. Paulo Santos" />
                </FieldGroup>
                <FieldGroup label="Hospital / Clinica">
                  <Input {...register('hospital')} placeholder="Hospital Sao Lucas" />
                </FieldGroup>
                <FieldGroup label="Data da cirurgia">
                  <Input {...register('surgeryDate')} type="date" />
                </FieldGroup>
              </div>
            </div>

            {/* Endereco */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Endereco
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                <div className="sm:col-span-2">
                  <FieldGroup label="CEP">
                    <Input {...register('zipCode')} placeholder="00000-000" />
                  </FieldGroup>
                </div>
                <div className="sm:col-span-4">
                  <FieldGroup label="Logradouro">
                    <Input {...register('address')} placeholder="Rua das Flores" />
                  </FieldGroup>
                </div>
                <div className="sm:col-span-1">
                  <FieldGroup label="Numero">
                    <Input {...register('number')} placeholder="123" />
                  </FieldGroup>
                </div>
                <div className="sm:col-span-2">
                  <FieldGroup label="Complemento">
                    <Input {...register('complement')} placeholder="Apto 4" />
                  </FieldGroup>
                </div>
                <div className="sm:col-span-3">
                  <FieldGroup label="Bairro">
                    <Input {...register('neighborhood')} placeholder="Centro" />
                  </FieldGroup>
                </div>
                <div className="sm:col-span-4">
                  <FieldGroup label="Cidade">
                    <Input {...register('city')} placeholder="Sao Paulo" />
                  </FieldGroup>
                </div>
                <div className="sm:col-span-2">
                  <FieldGroup label="Estado">
                    <Input {...register('state')} placeholder="SP" maxLength={2} className="uppercase" />
                  </FieldGroup>
                </div>
              </div>
            </div>

            {/* Observacoes */}
            <FieldGroup label="Observacoes">
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Informacoes adicionais sobre o paciente..."
                className={cn(
                  'w-full rounded-md border border-input px-3 py-2 text-sm bg-background resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                )}
              />
            </FieldGroup>

            {/* Botoes */}
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
                {isEditing ? 'Salvar alteracoes' : 'Criar cliente'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ── Pagina principal ──────────────────────────────────────────────────────────
export function ClientsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === UserRoles.ADMIN || user?.role === UserRoles.SUPER_ADMIN

  const [search,       setSearch]       = useState('')
  const [searchInput,  setSearchInput]  = useState('')
  const [page,         setPage]         = useState(1)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editingClient, setEditingClient] = useState<ClientDto | null>(null)
  const [deleteTarget,  setDeleteTarget]  = useState<ClientDto | null>(null)

  const { data, isLoading, isError } = useClients({ search, page, limit: 20 })
  const deleteMutation = useDeleteClient()

  const clients    = data?.data    ?? []
  const meta       = data?.meta
  const totalPages = meta?.totalPages ?? 1

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  function openCreate() {
    setEditingClient(null)
    setModalOpen(true)
  }

  function openEdit(client: ClientDto) {
    setEditingClient(client)
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
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {meta ? `${meta.total} cliente${meta.total !== 1 ? 's' : ''} cadastrado${meta.total !== 1 ? 's' : ''}` : 'Carregando...'}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </button>
      </div>

      {/* Filtros */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nome, CPF ou telefone..."
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          Buscar
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
            className="rounded-md border px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
          >
            Limpar
          </button>
        )}
      </form>

      {/* Tabela */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left font-medium px-4 py-3 text-muted-foreground">Nome</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground hidden md:table-cell">CPF</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground hidden sm:table-cell">Telefone</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground hidden lg:table-cell">Cidade</th>
              <th className="text-left font-medium px-4 py-3 text-muted-foreground hidden lg:table-cell">Cirurgia</th>
              <th className="text-right font-medium px-4 py-3 text-muted-foreground">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                  Carregando clientes...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-destructive">
                  Erro ao carregar clientes. Tente novamente.
                </td>
              </tr>
            )}
            {!isLoading && !isError && clients.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    {search ? 'Nenhum cliente encontrado para esta busca.' : 'Nenhum cliente cadastrado ainda.'}
                  </p>
                </td>
              </tr>
            )}
            {clients.map((client, idx) => (
              <tr
                key={client.id}
                className={cn('border-b last:border-0', idx % 2 === 0 ? 'bg-background' : 'bg-muted/20')}
              >
                <td className="px-4 py-3 font-medium">{client.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell font-mono text-xs">
                  {formatCPF(client.cpf)}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {client.phone}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                  {client.city ?? '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                  {formatDate(client.surgeryDate)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(client)}
                      className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      aria-label="Editar cliente"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => setDeleteTarget(client)}
                        className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label="Remover cliente"
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md p-1.5 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Pagina anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
      <ClientModal
        open={modalOpen}
        editing={editingClient}
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
              Remover cliente?
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mb-5">
              O cliente <strong>{deleteTarget?.name}</strong> sera removido do sistema.
              Esta acao pode ser revertida pela equipe de suporte.
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