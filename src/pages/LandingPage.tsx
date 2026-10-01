
import { Link } from 'react-router-dom';
import { ArrowRight,  Bed, ShieldCheck, Zap } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-primary">LOcAMed</div>
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition">Login</Link>
          <Link to="/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition">Começar Agora</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Locação de Poltronas Médicas <span className="text-primary">Simplificada</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          A plataforma completa para gestão de poltronas, reservas, logística e comissões. 
          Tudo o que você precisa para escalar seu negócio de locação em um só lugar.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition">
            Criar Conta Grátis <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-background rounded-2xl border space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <Bed size={24} />
            </div>
            <h3 className="text-xl font-bold">Gestão de Poltronas</h3>
            <p className="text-muted-foreground">Controle total de inventário, disponibilidade e bloqueios de manutenção.</p>
          </div>
          <div className="p-8 bg-background rounded-2xl border space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">Automação Financeira</h3>
            <p className="text-muted-foreground">Cobranças automáticas via Asaas com conciliação em tempo real via Webhooks.</p>
          </div>
          <div className="p-8 bg-background rounded-2xl border space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold">Rede de Parceiros</h3>
            <p className="text-muted-foreground">Sistema de indicação para médicos e clínicas com cálculo automático de comissões.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center space-y-6">
        <h2 className="text-3xl font-bold">Pronto para profissionalizar sua operação?</h2>
        <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition">
          Cadastre-se agora
        </Link>
      </section>
    </div>
  );
}
