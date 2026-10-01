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
  Ban,
} from 'lucide-react'
import { UserRoles, type UserRole } from '@/shared/types'

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
        label: 'Reservas',
        path:  '/reservations',
        icon:  Calendar,
      },
      {
        label: 'Bloqueios',
        path:  '/chair-blocks',
        icon:  Ban,
      },
      {
        label: 'Entregas',
        path:  '/deliveries',
        icon:  Truck,
      },
    ],
  },
  {
    label: 'Operacional',
    items: [
      {
        label: 'Poltronas',
        path:  '/chairs',
        icon:  Armchair,
      },
      {
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
  {
    label: 'Gestao',
    items: [
      {
        label:    'Financeiro',
        path:     '/financial',
        icon:     DollarSign,
      },
      {
        label:    'Disponibilidade',
        path:     '/availability',
        icon:     Calendar,
      },
      {
        label:    'Parceiros',
        path:     '/partners',
        icon:     Handshake,
      },
      {
        label:    'Comissões',
        path:     '/commissions',
        icon:     TrendingUp,
      },
      {
        label:    'Contratos',
        path:     '/contracts',
        icon:     FileText,
      },
    ],
  },
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
