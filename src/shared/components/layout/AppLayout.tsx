import { Outlet } from 'react-router-dom'
import { Sidebar, MobileSidebar } from './Sidebar'
import { Header } from './Header'
import { useSidebar } from '@/shared/hooks/useSidebar'

export function AppLayout() {
  const { isOpen, open, close } = useSidebar()

  return (
    <div className="flex h-screen overflow-hidden bg-brand-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar isOpen={isOpen} onClose={close} />

      {/* Main Viewport */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={open} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto scroll-smooth"
          aria-label="Conteúdo principal"
        >
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
