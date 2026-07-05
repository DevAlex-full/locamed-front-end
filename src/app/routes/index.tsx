import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'
import { ClientsPage } from '@/modules/clients/pages/ClientsPage'

// =============================================================================
// Router — Configuracao de rotas da aplicacao
// =============================================================================
//
// Hierarquia:
//   PublicRoute   → /login           → LoginPage
//
//   ProtectedRoute
//     AppLayout
//       /          → DashboardPage
//       /clients   → ClientsPage      (Etapa 10)
//
// Para adicionar novos modulos:
//   1. Importar a Page
//   2. Adicionar { path, element } em children do AppLayout
//   3. Remover disabled:true do item em nav-items.ts
// =============================================================================

export const router = createBrowserRouter([
  // ── Rotas publicas ─────────────────────────────────────────────────────────
  {
    element: <PublicRoute />,
    children: [
      {
        path:    '/login',
        element: <LoginPage />,
      },
    ],
  },

  // ── Rotas protegidas com layout ────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Dashboard
          {
            path:    '/',
            element: <DashboardPage />,
          },

          // Etapa 10: Clientes
          {
            path:    '/clients',
            element: <ClientsPage />,
          },

          // Etapas futuras:
          // { path: '/schedule',     element: <SchedulePage /> },
          // { path: '/reservations', element: <ReservationsPage /> },
          // { path: '/chairs',       element: <ChairsPage /> },
          // { path: '/deliveries',   element: <DeliveriesPage /> },
          // { path: '/financial',    element: <FinancialPage /> },
          // { path: '/contracts',    element: <ContractsPage /> },
          // { path: '/partners',     element: <PartnersPage /> },
          // { path: '/commissions',  element: <CommissionsPage /> },
          // { path: '/users',        element: <UsersPage /> },
          // { path: '/reports',      element: <ReportsPage /> },
          // { path: '/audit',        element: <AuditPage /> },
        ],
      },
    ],
  },

  // ── Rota nao encontrada ────────────────────────────────────────────────────
  {
    path:    '*',
    element: <Navigate to="/" replace />,
  },
])