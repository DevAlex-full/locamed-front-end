import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'

// =============================================================================
// Router — Configuracao de rotas da aplicacao
// =============================================================================
//
// Hierarquia:
//
//   PublicRoute         → /login        → LoginPage
//
//   ProtectedRoute
//     AppLayout         → layout pai de todas as rotas autenticadas
//       /               → DashboardPage
//       /schedule       → SchedulePage       (Etapa futura)
//       /reservations   → ReservationsPage   (Etapa futura)
//       /chairs         → ChairsPage         (Etapa futura)
//       /clients        → ClientsPage        (Etapa futura)
//       /deliveries     → DeliveriesPage     (Etapa futura)
//       /financial      → FinancialPage      (Etapa futura)
//       /contracts      → ContractsPage      (Etapa futura)
//       /partners       → PartnersPage       (Etapa futura)
//       /commissions    → CommissionsPage    (Etapa futura)
//       /users          → UsersPage          (Etapa futura)
//       /reports        → ReportsPage        (Etapa futura)
//       /audit          → AuditPage          (Etapa futura)
//
// Para adicionar novo modulo:
//   1. Importar a Page aqui
//   2. Adicionar { path: '/rota', element: <Page /> } em children do AppLayout
//   3. Remover disabled: true do item correspondente em nav-items.ts
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
          {
            path:    '/',
            element: <DashboardPage />,
          },

          // Modulos futuros — descomentados conforme implementados:
          // { path: '/schedule',     element: <SchedulePage /> },
          // { path: '/reservations', element: <ReservationsPage /> },
          // { path: '/chairs',       element: <ChairsPage /> },
          // { path: '/clients',      element: <ClientsPage /> },
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