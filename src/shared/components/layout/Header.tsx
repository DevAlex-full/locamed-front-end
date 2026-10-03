import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { UserMenu } from './UserMenu'
import { cn } from '@/lib/utils'
import { navGroups } from './nav-items'

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
  const pageLabel = buildBreadcrumb(pathname)

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 shrink-0',
        'flex items-center gap-4 px-6',
        'border-b border-slate-200 bg-brand-surface/80 backdrop-blur-md',
      )}
    >
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuClick}
        className={cn(
          'lg:hidden rounded-md p-2 -ml-2',
          'text-brand-slate hover:text-brand-navy hover:bg-slate-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/20',
          'transition-colors',
        )}
        aria-label="Abrir menu de navegação"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex-1 min-w-0">
        <ol className="flex items-center gap-2 text-xs">
          <li className="text-brand-slate font-medium">
            Poltronas Med
          </li>
          <li aria-hidden className="text-slate-300">/</li>
          <li className="text-brand-navy font-semibold capitalize tracking-tight">
            {pageLabel}
          </li>
        </ol>
      </nav>

      {/* User Area */}
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  )
}
