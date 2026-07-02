import { Outlet } from 'react-router-dom'
import { Sidebar, MobileSidebar } from './Sidebar'
import { Header } from './Header'
import { useSidebar } from '@/shared/hooks/useSidebar'

// =============================================================================
// AppLayout — Layout principal da aplicacao
// =============================================================================
//
// Renderizado como pai de todas as rotas protegidas.
// Estrutura:
//
//   +--sidebar (lg)--+------ main area ----------+
//   |                | header (sticky)            |
//   |   SidebarNav   +----------------------------+
//   |                |                            |
//   |                |   <Outlet />               |
//   |                |   (paginas filhas)         |
//   |                |                            |
//   +----------------+----------------------------+
//
// Mobile:
//   Sidebar se torna um drawer controlado por MobileSidebar.
//   O botao hamburger no Header dispara useSidebar().toggle().
//
// Uso no router (src/app/routes/index.tsx):
//   {
//     element: <ProtectedRoute />,
//     children: [{
//       element: <AppLayout />,
//       children: [
//         { path: '/', element: <DashboardPage /> },
//         ...
//       ]
//     }]
//   }
// =============================================================================

export function AppLayout() {
  const { isOpen, open, close } = useSidebar()

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* Sidebar Desktop — sempre visivel em lg+ */}
      <Sidebar />

      {/* Sidebar Mobile — drawer controlado por estado */}
      <MobileSidebar isOpen={isOpen} onClose={close} />

      {/* Area principal */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Header sticky */}
        <Header onMenuClick={open} />

        {/* Conteudo da pagina atual */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          aria-label="Conteudo principal"
        >
          <div className="h-full p-4 md:p-6">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}