import { useAuth } from '@/shared/hooks/useAuth'

// Placeholder — implementacao completa na Etapa 9+
export function DashboardPage() {
  const { user, company, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <button
            onClick={() => void signOut()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sair
          </button>
        </div>
        {user && (
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Usuario</p>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <span className="text-xs mt-1 inline-flex items-center rounded-full border px-2 py-0.5">
                {user.role}
              </span>
            </div>
            {company && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Empresa</p>
                <p className="font-medium">{company.name}</p>
                <p className="text-sm text-muted-foreground capitalize">Plano {company.plan}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground pt-2 border-t">
              Backend e frontend conectados. Modulos implementados a partir da Etapa 9.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
