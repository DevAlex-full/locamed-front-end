import { NavLink } from 'react-router-dom'
import { X, Heart } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import { cn } from '@/lib/utils'
import { navGroups, type NavItem } from './nav-items'

// =============================================================================
// Sidebar — Navegacao lateral da aplicacao
// =============================================================================
//
// Dois modos de uso:
//   Desktop: <Sidebar /> fixo no lado esquerdo (sempre visivel via CSS)
//   Mobile:  <MobileSidebar /> — overlay + drawer controlado por useSidebar()
//
// Sobre o padrao de icone (const Icon = item.icon):
//   Em TypeScript strict com jsx:react-jsx, usar uma propriedade de objeto
//   diretamente como elemento JSX (<item.icon />) pode falhar em algumas
//   versoes. A convencao segura e atribuir a uma variavel com letra maiuscula:
//     const Icon = item.icon
//     return <Icon className="..." />
//   Isso garante que TypeScript trate Icon como ComponentType, nao como
//   um accessor de propriedade, resolvendo o elemento JSX corretamente.
//
// Filtragem por role:
//   NavItems com allowedRoles sao ocultados para usuarios sem permissao.
//   NavItems com disabled:true renderizam como <span> (nao clicaveis).
// =============================================================================

interface SidebarProps {
  onClose?: () => void
}

// ── Conteudo compartilhado entre desktop e mobile ─────────────────────────────
function SidebarContent({ onClose }: SidebarProps) {
  const { user } = useAuth()

  function canSee(item: NavItem): boolean {
    if (!item.allowedRoles) return true
    if (!user) return false
    return item.allowedRoles.includes(user.role)
  }

  return (
    <div className="flex h-full flex-col">

      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between px-4 border-b shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-4 w-4 text-primary-foreground" aria-hidden />
          </div>
          <div className="leading-tight">
            <span className="text-sm font-semibold text-foreground">Poltronas</span>
            <span className="block text-[10px] text-muted-foreground tracking-wider uppercase">
              Med
            </span>
          </div>
        </div>

        {/* Botao fechar — apenas mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              'rounded-md p-1.5 text-muted-foreground',
              'hover:bg-accent hover:text-foreground',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'transition-colors',
            )}
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {/* Navegacao */}
      <nav aria-label="Navegacao principal" className="flex-1 overflow-y-auto py-3 px-2">
        {navGroups.map((group, groupIndex) => {
          const visibleItems = group.items.filter(canSee)
          if (visibleItems.length === 0) return null

          return (
            <div key={groupIndex} className={cn(groupIndex > 0 && 'mt-4')}>
              {/* Titulo do grupo */}
              {group.label && (
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}

              <ul role="list" className="space-y-0.5">
                {visibleItems.map((item) => {
                  // Atribuir a variavel maiuscula para JSX seguro em strict mode
                  const Icon = item.icon

                  return (
                    <li key={item.path}>
                      {item.disabled ? (
                        // Item desabilitado — visivel mas nao clicavel
                        <span
                          className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2',
                            'text-sm text-muted-foreground/50 cursor-not-allowed select-none',
                          )}
                          aria-disabled="true"
                          title="Em breve"
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden />
                          {item.label}
                          <span className="ml-auto text-[10px] text-muted-foreground/40 font-medium">
                            em breve
                          </span>
                        </span>
                      ) : (
                        // Item ativo — NavLink com estilo condicional
                        <NavLink
                          to={item.path}
                          end={item.path === '/'}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 rounded-md px-3 py-2',
                              'text-sm font-medium transition-colors duration-100',
                              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                            )
                          }
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden />
                          {item.label}
                        </NavLink>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* Rodape */}
      <div className="border-t px-4 py-3 shrink-0">
        <p className="text-[10px] text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Poltronas Med
        </p>
      </div>

    </div>
  )
}

// ── Sidebar Desktop — sempre visivel em lg+ ───────────────────────────────────
export function Sidebar() {
  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col',
        'w-64 shrink-0 h-screen sticky top-0',
        'border-r bg-background',
      )}
      aria-label="Sidebar"
    >
      <SidebarContent />
    </aside>
  )
}

// ── Sidebar Mobile — overlay + drawer ────────────────────────────────────────
interface MobileSidebarProps {
  isOpen:  boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col',
          'w-64 bg-background border-r shadow-xl',
          'lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'transition-transform duration-200 ease-in-out',
        )}
        aria-label="Menu mobile"
        role="dialog"
        aria-modal="true"
      >
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  )
}