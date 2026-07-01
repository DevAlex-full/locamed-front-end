import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'

// =============================================================================
// PublicRoute — Guard para rotas publicas (ex: /login)
// =============================================================================
//
// Comportamento:
//   loading  → exibe spinner enquanto verifica sessao inicial
//   com sessao → redireciona para / (usuario ja esta logado)
//   sem sessao → renderiza <Outlet /> (exibe a rota publica normalmente)
//
// Uso no router:
//   {
//     element: <PublicRoute />,
//     children: [{ path: '/login', element: <LoginPage /> }],
//   }
//
// Isso garante que um usuario autenticado que acesse /login diretamente
// seja redirecionado automaticamente para o dashboard.
// =============================================================================

export function PublicRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (session) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}