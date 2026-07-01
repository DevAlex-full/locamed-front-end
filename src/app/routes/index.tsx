import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'

// =============================================================================
// Router — Configuracao de rotas da aplicacao
// =============================================================================
//
// Guardas de rota:
//   PublicRoute  → redireciona usuario JA autenticado para /
//                  (impede acesso a /login quando ja logado)
//
//   ProtectedRoute → redireciona usuario NAO autenticado para /login
//                    (protege todas as rotas de negocio)
//
// Adicionar rotas protegidas futuras como children de ProtectedRoute:
//   { path: '/users',        element: <UsersPage /> },        // Etapa 9
//   { path: '/clients',      element: <ClientsPage /> },      // Etapa 9
//   { path: '/chairs',       element: <ChairsPage /> },       // Etapa 10
//   { path: '/reservations', element: <ReservationsPage /> }, // Etapa 11
// =============================================================================

export const router = createBrowserRouter([
  // ── Rotas publicas (redireciona para / se ja autenticado) ──────────────────
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },

  // ── Rotas protegidas (redireciona para /login se nao autenticado) ──────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      // Modulos futuros adicionados aqui
    ],
  },

  // ── Rota nao encontrada ────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])