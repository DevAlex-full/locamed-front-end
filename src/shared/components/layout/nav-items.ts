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
// Ativos nesta etapa:
//   Dashboard  → /
//   Clientes   → /clients    (Etapa 10)
//   Poltronas  → /chairs     (Etapa 11) ← disabled removido aqui
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
        // Etapa 11: Poltronas ativo
        label: 'Poltronas',
        path:  '/chairs',
        icon:  Armchair,
      },
      {
        // Etapa 10: Clientes ativo
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