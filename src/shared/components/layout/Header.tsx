import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { UserMenu } from './UserMenu'
import { cn } from '@/lib/utils'
import { navGroups } from './nav-items'

// =============================================================================
// Header — Barra superior da aplicacao
// =============================================================================
//
// Conteudo:
//   - Botao hamburger (apenas mobile) → abre MobileSidebar
//   - Breadcrumb derivado da rota atual
//   - UserMenu (avatar + dropdown)
//
// Breadcrumb:
//   Derivado automaticamente do pathname via `buildBreadcrumb()`.
//   Usa a lista de navGroups para mapear path -> label.
//   Nao precisa de configuracao adicional ao adicionar novas rotas.
// =============================================================================

// Mapeamento de path → label para o breadcrumb
const pathToLabel = new Map<string, string>()
for (const group of navGroups) {
  for (const item of group.items) {
    pathToLabel.set(item.path, item.label)
  }
}

function buildBreadcrumb(pathname: string): string {
  if (pathname === '/') return 'Dashboard'
  return pathToLabel.get(pathname) ?? pathname.replace('/', '').replace(/-/g, ' ')
}

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const pageLabel    = buildBreadcrumb(pathname)

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 shrink-0',
        'flex items-center gap-3 px-4 md:px-6',
        'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      )}
    >
      {/* Botao hamburger — visivel apenas no mobile */}
      <button
        onClick={onMenuClick}
        className={cn(
          'lg:hidden rounded-md p-2 -ml-2',
          'text-muted-foreground hover:text-foreground hover:bg-accent',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'transition-colors',
        )}
        aria-label="Abrir menu de navegacao"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex-1 min-w-0">
        <ol className="flex items-center gap-1.5 text-sm">
          <li>
            <span className="text-muted-foreground text-xs">Poltronas Med</span>
          </li>
          <li aria-hidden className="text-muted-foreground text-xs">/</li>
          <li>
            <span
              className="font-medium text-foreground capitalize"
              aria-current="page"
            >
              {pageLabel}
            </span>
          </li>
        </ol>
      </nav>

      {/* Menu do usuario */}
      <UserMenu />
    </header>
  )
}