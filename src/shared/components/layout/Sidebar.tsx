import { NavLink } from 'react-router-dom'
import { X, Heart } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import { cn } from '@/lib/utils'
import { navGroups, type NavItem } from './nav-items'
import { Button } from '@/components/ui/Button'

// =============================================================================
// Sidebar — Navegação lateral da aplicação (Luxury Medical Edition)
// =============================================================================

interface SidebarProps {
  onClose?: () => void
}

function SidebarContent({ onClose }: SidebarProps) {
  const { user } = useAuth()

  function canSee(item: NavItem): boolean {
    if (!item.allowedRoles) return true
    if (!user) return false
    return item.allowedRoles.includes(user.role)
  }

  return (
    <div className="flex h-full flex-col bg-brand-surface">
      {/* Logo / Brand Area */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-navy shadow-premium">
            <Heart className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-brand-navy tracking-tight">
              Poltronas Med
            </span>
            <span className="text-[10px] text-brand-slate font-medium uppercase tracking-widest">
              Luxury Medical SaaS
            </span>
          </div>
        </div>

        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8 p-0 text-brand-slate"
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        )}
      </div>

      {/* Main Navigation */}
      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {navGroups.map((group, groupIndex) => {
          const visibleItems = group.items.filter(canSee)
          if (visibleItems.length === 0) return null

          return (
            <div key={groupIndex} className="space-y-3">
              {group.label && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-brand-slate/60">
                  {group.label}
                </p>
              )}
              <ul role="list" className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.path}>
                      {item.disabled ? (
                        <div
                          className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2',
                            'text-sm text-slate-400 cursor-not-allowed select-none',
                          )}
                          aria-disabled="true"
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden />
                          <span className="font-medium">{item.label}</span>
                          <span className="ml-auto text-[10px] italic text-slate-300">
                            em breve
                          </span>
                        </div>
                      ) : (
                        <NavLink
                          to={item.path}
                          end={item.path === '/'}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-200',
                              'text-sm font-medium group',
                              isActive
                                ? 'bg-brand-navy text-white shadow-premium'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-brand-navy',
                            )
                          }
                        >
                          <Icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-brand-navy" aria-hidden />
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

      {/* Footer */}
      <div className="border-t border-slate-100 px-6 py-4 shrink-0 bg-slate-50/50">
        <p className="text-[11px] text-brand-slate/60 text-center font-medium">
          &copy; {new Date().getFullYear()} Poltronas Med
        </p>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col',
        'w-64 shrink-0 h-screen sticky top-0',
        'border-r border-slate-200 bg-brand-surface',
      )}
      aria-label="Sidebar"
    >
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-brand-navy/40 backdrop-blur-sm lg:hidden"
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col',
          'w-64 bg-brand-surface border-r border-slate-200 shadow-premium-lg',
          'lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'transition-transform duration-300 ease-out',
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
