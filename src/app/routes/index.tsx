import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      // Modulos futuros adicionados aqui:
      // { path: '/users',        element: <UsersPage /> },
      // { path: '/clients',      element: <ClientsPage /> },
      // { path: '/chairs',       element: <ChairsPage /> },
      // { path: '/reservations', element: <ReservationsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
