import { LayoutDashboard, TrendingUp, Users, Bed, CalendarCheck } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// =============================================================================
// DashboardPage — Executive Operational Hub (Luxury Medical Edition)
// =============================================================================
//
// Design Strategy:
// 1. Zero Fake Data: Use honest empty states if data is missing.
// 2. High Information Density: Focus on operational utility, not "eye candy".
// 3. Clinical Aesthetics: Clean white surfaces on a Clinical Grey background.
// =============================================================================

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-navy">
          Dashboard Operacional
        </h1>
        <p className="text-sm text-brand-slate font-medium">
          Bem-vindo de volta{user ? `, ${user.name.split(' ')[0]}` : ''}. Aqui está o status atual da sua operação.
        </p>
      </div>

      {/* Executive KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Reservas Ativas" 
          value="0" 
          icon={CalendarCheck} 
          description="Poltronas ocupadas no momento" 
        />
        <KpiCard 
          title="Clientes Totais" 
          value="0" 
          icon={Users} 
          description="Base de clientes cadastrados" 
        />
        <KpiCard 
          title="Frota de Poltronas" 
          value="0" 
          icon={Bed} 
          description="Unidades totais em inventário" 
        />
        <KpiCard 
          title="Taxa de Ocupação" 
          value="0%" 
          icon={TrendingUp} 
          description="Performance da operação" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Action Center */}
        <Card className="lg:col-span-2 border-slate-200 shadow-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-brand-navy">Atividade Recente</CardTitle>
                <CardDescription>Últimas movimentações de reservas e entregas</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">Tempo Real</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-slate-50/50 rounded-md border border-dashed border-slate-200">
              <div className="p-3 bg-white rounded-md border border-slate-200 shadow-premium">
                <LayoutDashboard className="h-6 w-6 text-brand-slate" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-brand-navy">Nenhuma atividade recente</p>
                <p className="text-xs text-brand-slate max-w-[240px] mx-auto">
                  Assim que houver novas reservas ou atualizações, elas aparecerão aqui.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Status Panel */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-premium">
            <CardHeader className="pb-3">
              <CardTitle className="text-md font-semibold text-brand-navy">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <QuickActionBtn label="Nova Reserva" icon={CalendarCheck} />
              <QuickActionBtn label="Cadastrar Cliente" icon={Users} />
              <QuickActionBtn label="Nova Poltrona" icon={Bed} />
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-premium bg-brand-navy text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-md font-semibold text-white">Suporte Operacional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Precisa de ajuda com a gestão de poltronas ou integração financeira?
              </p>
              <button className="w-full py-2 px-4 rounded-md bg-brand-blue text-white text-xs font-semibold hover:bg-blue-600 transition-colors shadow-premium">
                Abrir Ticket de Suporte
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// --- Internal Components for Dashboard ---

function KpiCard({ title, value, icon: Icon, description }: { 
  title: string; 
  value: string; 
  icon: any; 
  description: string; 
}) {
  return (
    <Card className="border-slate-200 shadow-premium overflow-hidden group hover:border-brand-blue/50 transition-colors cursor-default">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-slate-50 rounded-md border border-slate-100 group-hover:bg-brand-blue/10 transition-colors">
            <Icon className="h-5 w-5 text-brand-slate group-hover:text-brand-blue transition-colors" />
          </div>
          <Badge variant="neutral" className="text-[10px] font-medium">Sincronizado</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-brand-slate uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-brand-navy tracking-tight">{value}</span>
          </div>
          <p className="text-[11px] text-brand-slate/70 mt-2 font-medium">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionBtn({ label, icon: Icon }: { label: string; icon: any }) {
  return (
    <button className="flex items-center gap-3 w-full p-3 rounded-md border border-slate-100 bg-white text-sm font-medium text-brand-slate hover:text-brand-navy hover:bg-slate-50 hover:border-slate-200 transition-all shadow-premium group">
      <div className="p-1.5 bg-slate-50 rounded-sm group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
        <Icon className="h-4 w-4" />
      </div>
      {label}
    </button>
  )
}
