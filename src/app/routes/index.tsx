import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';

const ReservationsPage = lazy(() => import('@/modules/reservations/pages/ReservationsPage').then(m => ({ default: m.ReservationsPage })));
const DeliveriesPage = lazy(() => import('@/modules/deliveries/pages/DeliveriesPage').then(m => ({ default: m.DeliveriesPage })));
const ChairsPage = lazy(() => import('@/modules/chairs/pages/ChairsPage').then(m => ({ default: m.ChairsPage })));
const ClientsPage = lazy(() => import('@/modules/clients/pages/ClientsPage').then(m => ({ default: m.ClientsPage })));
const FinancialPage = lazy(() => import('@/modules/financial/pages/FinancialPage').then(m => ({ default: m.FinancialPage })));
const AvailabilityPage = lazy(() => import('@/modules/availability/pages/AvailabilityPage').then(m => ({ default: m.AvailabilityPage })));
const PartnerPage = lazy(() => import('@/modules/partners/pages/PartnerPage').then(m => ({ default: m.PartnerPage })));
const CommissionPage = lazy(() => import('@/modules/commissions/pages/CommissionPage').then(m => ({ default: m.CommissionPage })));
const ContractsPage = lazy(() => import('@/modules/contracts/pages/ContractsPage').then(m => ({ default: m.default })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <DashboardPage />
      </Suspense>
    ),
  },
  {
    path: '/reservations',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <ReservationsPage />
      </Suspense>
    ),
  },
  {
    path: '/deliveries',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <DeliveriesPage />
      </Suspense>
    ),
  },
  {
    path: '/chairs',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <ChairsPage />
      </Suspense>
    ),
  },
  {
    path: '/clients',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <ClientsPage />
      </Suspense>
    ),
  },
  {
    path: '/financial',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <FinancialPage />
      </Suspense>
    ),
  },
  {
    path: '/availability',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <AvailabilityPage />
      </Suspense>
    ),
  },
  {
    path: '/partners',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <PartnerPage />
      </Suspense>
    ),
  },
  {
    path: '/commissions',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <CommissionPage />
      </Suspense>
    ),
  },
  {
    path: '/contracts',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <ContractsPage />
      </Suspense>
    ),
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
