import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'

// =============================================================================
// PublicRoute — Guard para rotas publicas (ex: /login)
// =============================================================================
//
// Comportamento:
//   loading    → exibe spinner enquanto verifica sessao inicial
//   com sessao → redireciona para / (usuario ja esta logado)
//   sem sessao → renderiza <Outlet /> (exibe a rota publica normalmente)
//
// Garante que usuario autenticado nao consiga acessar /login.
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