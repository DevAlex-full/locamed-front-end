import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Armchair,
  Users,
  Truck,
  DollarSign,
  FileText,
  Handshake,
  TrendingUp,
  BarChart3,
  UserCog,
  ClipboardList,
} from 'lucide-react'
import { UserRoles, type UserRole } from '@/shared/types'

// =============================================================================
// Configuracao declarativa da navegacao lateral
// =============================================================================
//
// disabled: true  → item renderizado como <span> ("em breve"), nao clicavel
// disabled: false → item renderizado como <NavLink>, clicavel e com rota ativa
//
// Para ativar um modulo:
//   1. Remover disabled: true (ou setar disabled: false)
//   2. Adicionar a rota em src/app/routes/index.tsx
//   3. Criar a Page em src/modules/<modulo>/pages/
// =============================================================================

type IconComponent = typeof LayoutDashboard

export interface NavItem {
  label:         string
  path:          string
  icon:          IconComponent
  allowedRoles?: UserRole[]
  disabled?:     boolean
}

export interface NavGroup {
  label?: string
  items:  NavItem[]
}

export const navGroups: NavGroup[] = [
  // ── Principal ─────────────────────────────────────────────────────────────
  {
    items: [
      {
        label: 'Dashboard',
        path:  '/',
        icon:  LayoutDashboard,
      },
      {
        label:    'Agenda',
        path:     '/schedule',
        icon:     CalendarDays,
        disabled: true,
      },
      {
        label:    'Reservas',
        path:     '/reservations',
        icon:     Calendar,
        disabled: true,
      },
    ],
  },

  // ── Operacional ───────────────────────────────────────────────────────────
  {
    label: 'Operacional',
    items: [
      {
        label:    'Poltronas',
        path:     '/chairs',
        icon:     Armchair,
        disabled: true,
      },
      {
        // Etapa 10: Clientes ativo — disabled removido
        label: 'Clientes',
        path:  '/clients',
        icon:  Users,
      },
      {
        label:    'Entregas',
        path:     '/deliveries',
        icon:     Truck,
        disabled: true,
      },
    ],
  },

  // ── Gestao ────────────────────────────────────────────────────────────────
  {
    label: 'Gestao',
    items: [
      {
        label:    'Financeiro',
        path:     '/financial',
        icon:     DollarSign,
        disabled: true,
      },
      {
        label:    'Contratos',
        path:     '/contracts',
        icon:     FileText,
        disabled: true,
      },
      {
        label:    'Parceiros',
        path:     '/partners',
        icon:     Handshake,
        disabled: true,
      },
      {
        label:    'Comissoes',
        path:     '/commissions',
        icon:     TrendingUp,
        disabled: true,
      },
    ],
  },

  // ── Administracao (admin e super_admin) ───────────────────────────────────
  {
    label: 'Administracao',
    items: [
      {
        label:        'Usuarios',
        path:         '/users',
        icon:         UserCog,
        allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN],
        disabled:     true,
      },
      {
        label:        'Relatorios',
        path:         '/reports',
        icon:         BarChart3,
        allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN],
        disabled:     true,
      },
      {
        label:        'Auditoria',
        path:         '/audit',
        icon:         ClipboardList,
        allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN],
        disabled:     true,
      },
    ],
  },
]