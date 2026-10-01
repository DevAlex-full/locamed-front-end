import { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import { useContracts, useCreateContract, useSignContract } from '../hooks/useContracts'
import { type ContractFilters } from '../types'
import { toast } from 'sonner'

export default function ContractsPage() {
  const [filters, setFilters] = useState<ContractFilters>({ page: 1 })
  const page = filters.page || 1
  const limit = 20

  const { data, isLoading, isError } = useContracts(filters, page, limit)
  const { mutate: createContract, isPending: isCreating } = useCreateContract()
  const { mutate: signContract, isPending: isSigning } = useSignContract()

  const handlePageChange = (newPage: number) => {
    setFilters(f => ({ ...f, page: newPage }))
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Erro ao carregar contratos</h2>
        <p className="text-muted-foreground">Tente atualizar a página ou contate o suporte.</p>
      </div>
    )
  }

  const contracts = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">Gerencie a documentação e assinaturas de reservas.</p>
        </div>
        <button 
          onClick={() => {
            const resId = prompt('Insira o UUID da Reserva:')
            if (resId) {
              createContract({ reservationId: resId, storageUrl: 'https://storage.locamed.com/mock-contract.pdf' }, {
                onSuccess: () => toast.success('Contrato gerado com sucesso'),
                onError: (e: any) => toast.error(e.message)
              })
            }
          }}
          disabled={isCreating}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isCreating ? 'Gerando...' : 'Novo Contrato'}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <input 
              type="text"
              placeholder="Filtrar por Reserva (UUID)..."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={filters.reservationId || ''}
              onChange={(e) => setFilters(f => ({ ...f, reservationId: e.target.value, page: 1 }))}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Contrato</th>
                <th className="px-4 py-3 text-left font-medium">Reserva</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Data Assinatura</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum contrato encontrado.
                  </td>
                </tr>
              ) : (
                contracts.map((c: any) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">v{c.version}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{c.reservation_id}</td>
                    <td className="px-4 py-3">
                      {c.signed_at ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          <CheckCircle2 className="h-3 w-3" /> Assinado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          <Clock className="h-3 w-3" /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.signed_at ? new Date(c.signed_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <a 
                          href={c.storage_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground"
                          title="Visualizar PDF"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        {!c.signed_at && (
                          <button 
                            onClick={() => {
                              const notes = prompt('Notas da assinatura:');
                              signContract({ 
                                id: c.id, 
                                data: { 
                                  signedAt: new Date().toISOString(), 
                                  signedBy: 'Sistema/Cliente', 
                                  signatureIp: '127.0.0.1', 
                                  notes: notes || undefined 
                                } 
                              }, {
                                onSuccess: () => toast.success('Contrato assinado com sucesso'),
                                onError: (e: any) => toast.error(e.message)
                              })
                            }}
                            disabled={isSigning}
                            className="p-2 hover:bg-accent rounded-md text-primary hover:text-primary-foreground"
                            title="Assinar Contrato"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-muted-foreground">
            Mostrando {contracts.length} de {total} contratos
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(page - 1)} 
              disabled={page <= 1}
              className="p-1.5 rounded-md border bg-background hover:bg-accent disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium">Página {page} de {totalPages}</span>
            <button 
              onClick={() => handlePageChange(page + 1)} 
              disabled={page >= totalPages}
              className="p-1.5 rounded-md border bg-background hover:bg-accent disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
