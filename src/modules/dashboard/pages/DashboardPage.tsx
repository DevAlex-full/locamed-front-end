import { LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'

// =============================================================================
// DashboardPage — Placeholder
// =============================================================================
//
// Esta pagina e renderizada dentro do <AppLayout /> (via <Outlet />).
// O layout (sidebar, header, padding) ja e fornecido pelo AppLayout.
// Esta pagina deve conter apenas o conteudo especifico do dashboard.
//
// Implementacao real: Etapa 10+ (KPIs, graficos, resumos)
// =============================================================================

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Cabecalho da pagina */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bem-vindo de volta{user ? `, ${user.name.split(' ')[0]}` : ''}!
        </p>
      </div>

      {/* Placeholder de conteudo */}
      <div className="rounded-xl border border-dashed bg-muted/30 p-12">
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <LayoutDashboard className="h-6 w-6 text-muted-foreground" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Dashboard em construcao
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              KPIs, graficos e resumos serao implementados nas proximas etapas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}