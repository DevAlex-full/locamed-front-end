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
// Tipo do icon:
//   Usa `typeof LayoutDashboard` em vez de `FC<LucideProps>`.
//   Motivo: LucideProps é um tipo interno de lucide-react que pode nao ser
//   resolvido corretamente com moduleResolution:bundler + isolatedModules:true.
//   `typeof LayoutDashboard` é 100% seguro — resolve o tipo exato do componente
//   a partir do VALUE importado, sem depender de exports de tipo do pacote.
//
// Para adicionar um novo modulo:
//   1. Importar o icone Lucide aqui
//   2. Adicionar NavItem no grupo correto
//   3. Remover disabled:true quando a rota for implementada
//   4. Adicionar a rota em src/app/routes/index.tsx
// =============================================================================

// Tipo do icone derivado do componente real — sem dependencia de LucideProps
type IconComponent = typeof LayoutDashboard

export interface NavItem {
  label:         string
  path:          string
  icon:          IconComponent
  allowedRoles?: UserRole[]   // undefined = qualquer usuario autenticado
  disabled?:     boolean      // true = item ainda nao implementado
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
        label:    'Clientes',
        path:     '/clients',
        icon:     Users,
        disabled: true,
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