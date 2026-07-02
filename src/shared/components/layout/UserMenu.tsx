import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOut, User, Building2, ChevronDown } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import { cn } from '@/lib/utils'

// =============================================================================
// UserMenu — Avatar + dropdown com informacoes do usuario e logout
// =============================================================================
//
// Usa @radix-ui/react-dropdown-menu (ja instalado no package.json).
// Acessivel: navega por teclado, fecha com Esc, focus trap correto.
//
// Exibe:
//   - Iniciais do usuario no avatar (fallback se sem avatarUrl)
//   - Nome e email no header do dropdown
//   - Nome da empresa e plano
//   - Botao de logout
// =============================================================================

// ── Componente de Avatar ──────────────────────────────────────────────────────
function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-8 w-8 rounded-full object-cover"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'h-8 w-8 rounded-full flex items-center justify-center',
        'bg-primary text-primary-foreground text-xs font-semibold select-none',
      )}
    >
      {initials}
    </div>
  )
}

// ── UserMenu ──────────────────────────────────────────────────────────────────
export function UserMenu() {
  const { user, company, signOut } = useAuth()

  if (!user) return null

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 rounded-lg px-2 py-1.5',
            'hover:bg-accent transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
          aria-label="Menu do usuario"
        >
          <Avatar name={user.name} avatarUrl={user.avatarUrl} />
          <span className="hidden md:block text-sm font-medium text-foreground max-w-[140px] truncate">
            {user.name.split(' ')[0]}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" aria-hidden />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            'z-50 min-w-[220px] rounded-lg border bg-popover shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2',
          )}
        >
          {/* Header: informacoes do usuario */}
          <div className="px-3 py-3 border-b">
            <div className="flex items-center gap-2.5 mb-2.5">
              <Avatar name={user.name} avatarUrl={user.avatarUrl} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-popover-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            {/* Badge de role */}
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
              <User className="h-2.5 w-2.5" aria-hidden />
              {user.role}
            </span>
          </div>

          {/* Empresa */}
          {company && (
            <div className="px-3 py-2.5 border-b">
              <div className="flex items-start gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-popover-foreground truncate">
                    {company.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    Plano {company.plan}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Acoes */}
          <div className="p-1">
            <DropdownMenu.Item
              onSelect={() => void signOut()}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-2',
                'text-sm text-destructive cursor-pointer select-none',
                'hover:bg-destructive/10 focus:bg-destructive/10',
                'focus:outline-none transition-colors duration-100',
              )}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sair da conta
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}