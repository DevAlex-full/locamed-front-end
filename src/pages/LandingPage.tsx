import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Bed, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  Users, 
  CreditCard, 
  Truck, 
  FileText, 
  Handshake, 
  Percent,
  CheckCircle2,
  ChevronRight,
  Lock,
  Activity
} from 'lucide-react';

function SectionHeading({ title, subtitle, alignment = 'center' }: { title: string, subtitle: string, alignment?: 'center' | 'left' }) {
  return (
    <div className={`mb-16 space-y-4 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-navy leading-tight">
        {title}
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-80 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="group relative p-8 bg-brand-surface border border-input hover:border-primary/50 transition-all duration-500 rounded-sm shadow-premium-sm hover:shadow-premium-md">
      <div className="mb-6 inline-flex items-center justify-center h-12 w-12 rounded-sm bg-brand-navy text-brand-surface transition-transform group-hover:scale-110 duration-300">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground opacity-90">
        {description}
      </p>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-background text-foreground font-sans selection:bg-primary/20">
      <nav className="sticky top-0 z-50 w-full border-b border-input bg-brand-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-brand-navy rounded-sm flex items-center justify-center shadow-premium-sm">
              <span className="text-brand-surface font-bold text-xs">LM</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-brand-navy uppercase">LOcAMed</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <a href="#solucao" className="hover:text-brand-navy transition-colors">Solução</a>
            <a href="#modulos" className="hover:text-brand-navy transition-colors">Ecossistema</a>
            <a href="#beneficios" className="hover:text-brand-navy transition-colors">Valor</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors px-4 py-2">
              Entrar
            </Link>
            <Link to="/register" className="bg-brand-navy text-brand-surface px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-brand-navy/90 transition-all active:scale-[0.98] shadow-premium-sm">
              Implementar Agora
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-40 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-[0.03] [background-image:linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:60px_60px]"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12 text-left">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Standard de Gestão Médica 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95] text-brand-navy">
              Precisão <br />
              <span className="text-primary italic font-serif">Cirúrgica</span> <br />
              na Gestão.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl opacity-80 font-medium">
              O ecossistema definitivo para operação de poltronas pós-cirúrgicas. Substitua o caos das planilhas por um fluxo linear, auditável e lucrativo.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/register" className="flex items-center justify-center gap-3 px-10 py-5 bg-brand-navy text-brand-surface rounded-sm font-bold text-lg hover:bg-brand-navy/90 transition-all active:scale-[0.98] shadow-premium-lg group">
                Implementar no Negócio 
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#modulos" className="flex items-center justify-center gap-3 px-10 py-5 border border-input rounded-sm font-bold text-lg hover:bg-muted transition-all active:scale-[0.98]">
                Ver Ecossistema
              </a>
            </div >
            <div className="pt-6 flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Conciliação Asaas</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Gestão de Comissões</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Zero Setup Complexo</div>
            </div >
          </div >
          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-sm border border-input bg-brand-surface shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
              <div className="h-12 bg-brand-navy border-b border-input flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
                </div >
                <div className="mx-auto bg-brand-background/50 px-4 py-1 rounded-sm text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  app.locamed.com/dashboard
                </div >
              </div >
              <div className="p-8 flex-1 space-y-8 bg-brand-background">
                <div className="grid grid-cols-3 gap-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-28 rounded-sm border border-input bg-brand-surface p-5 space-y-3 shadow-sm">
                      <div className="h-2 w-1/3 bg-muted rounded-full"></div >
                      <div className="h-6 w-1/2 bg-brand-navy/10 rounded-full"></div >
                      <div className="h-2 w-1/4 bg-muted rounded-full"></div >
                    </div >
                  ))}
                </div >
                <div className="h-64 rounded-sm border border-input bg-brand-surface p-6 space-y-4 shadow-sm">
                  <div className="h-4 w-1/4 bg-muted rounded-full mb-6"></div >
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-10 w-full border-b border-input/50 flex items-center px-3 gap-4">
                        <div className="w-5 h-5 rounded-sm bg-primary/20 shrink-0"></div >
                        <div className="h-2 w-1/3 bg-muted rounded-full"></div >
                        <div className="h-2 w-1/4 bg-muted rounded-full ml-auto"></div >
                      </div >
                    ))}
                  </div >
                </div >
              </div >
            </div >
          </div >
        </div >
      </section>

      <section id="solucao" className="py-32 px-6 bg-brand-navy text-brand-surface">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              O custo invisível do <br /><span className="text-primary">caos operacional.</span>
            </h2>
            <div className="space-y-8">
              {[
                { title: "Logística Cega", desc: "A incerteza sobre a localização real de cada poltrona gera atrasos e perda de receita." },
                { title: "Erosão Financeira", desc: "Cobranças esquecidas e falta de conciliação automática drenam o lucro líquido." },
                { title: "Ruído com Parceiros", desc: "Cálculos manuais de comissão geram desconfiança e fricção com médicos indicadores." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="mt-1 h-6 w-6 rounded-sm border border-brand-surface/30 bg-brand-surface/10 flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
                    <span className="text-brand-surface/50 text-[10px] font-bold group-hover:text-primary">✕</span>
                  </div >
                  <div >
                    <h4 className="font-bold text-lg text-brand-surface">{item.title}</h4>
                    <p className="text-sm text-brand-surface/60 leading-relaxed max-w-md">{item.desc}</p>
                  </div >
                </div >
              ))}
            </div >
          </div >
          <div className="bg-brand-background border border-brand-surface/20 p-12 rounded-sm relative shadow-2xl">
             <div className="absolute -top-4 -left-4 h-8 w-8 bg-primary rounded-sm shadow-lg"></div >
             <h3 className="text-2xl font-bold text-brand-navy mb-6 tracking-tight">A Solução LocaMed</h3>
             <p className="text-muted-foreground leading-relaxed mb-10 text-lg">
               Transformamos a locação em um fluxo linear e auditável. Cada reserva dispara automaticamente a cobrança, a logística e a comissão.
             </p>
             <div className="space-y-5">
               {["Visibilidade de Inventário em Tempo Real", "Automação Financeira via Asaas", "Gestão de Parceiros e Comissões", "Rastreabilidade de Entregas e Coletas"].map((text, i) => (
                 <div key={i} className="flex items-center gap-4 text-sm font-bold text-brand-navy">
                   <CheckCircle2 size={18} className="text-primary shrink-0" /> {text}
                 </div >
               ))}
             </div >
          </div >
        </div >
      </section>

      <section id="modulos" className="py-32 px-6 max-w-7xl mx-auto">
        <SectionHeading title="Arquitetura de Operação" subtitle="Módulos integrados que cobrem todo o ciclo de vida da locação, desde a prospecção até a liquidação financeira." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={Users} title="CRM de Pacientes" description="Gestão especializada para pacientes pós-cirúrgicos, com histórico completo de locações e contratos." />
          <FeatureCard icon={Bed} title="Controle de Inventário" description="Gestão rigorosa de poltronas: status de disponibilidade, manutenção e alocação por categoria." />
          <FeatureCard icon={Calendar} title="Reservas Inteligentes" description="Calendário operacional com visão de disponibilidade e agendamento rápido de entregas e coletas." />
          <FeatureCard icon={Truck} title="Logística de Frota" description="Fluxo de entrega e coleta organizado, garantindo a pontualidade necessária para o pós-operatório." />
          <FeatureCard icon={FileText} title="Contratos Digitais" description="Formalização jurídica transparente para cada locação, com controle rigoroso de termos e prazos." />
          <FeatureCard icon={CreditCard} title="Financeiro Precision" description="Fluxo de caixa, conciliação automática e gestão de cobranças integrada via API Asaas." />
          <FeatureCard icon={Handshake} title="Rede de Parceiros" description="Gestão de médicos e clínicas parceiras, transformando indicações em crescimento previsível." />
          <FeatureCard icon={Percent} title="Cálculo de Comissões" description="Transparência total no pagamento de comissões por indicação, calculado automaticamente pelo sistema." />
          <FeatureCard icon={ShieldCheck} title="Visão de Disponibilidade" description="Análise macro de frota disponível vs. alocada para tomada de decisão rápida e escalável." />
        </div >
      </section>

      <section className="py-32 px-6 bg-brand-surface border-y border-input">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-navy">Fluxo Operacional Linear</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg opacity-80">Do primeiro contato à liquidação financeira. Um processo sem fricção.</p>
          </div >
          <div className="grid md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-input -z-10"></div >
            {[
              { step: "01", label: "Reserva", desc: "Alocação da poltrona e cadastro do cliente." },
              { step: "02", label: "Pagamento", desc: "Emissão automática de cobrança via API Asaas." },
              { step: "03", label: "Logística", desc: "Agendamento de entrega e coleta via sistema." },
              { step: "04", label: "Comissão", desc: "Liquidação automática do parceiro indicador." },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-6 group">
                <div className="mx-auto h-24 w-24 rounded-sm border-2 border-input flex items-center justify-center text-2xl font-bold bg-brand-background group-hover:border-primary transition-all duration-300 shadow-sm">
                  {item.step}
                </div >
                <h4 className="text-lg font-bold text-brand-navy">{item.label}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">{item.desc}</p>
              </div >
            ))}
          </div >
        </div >
      </section>

      <section id="beneficios" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <SectionHeading title="Ganhe escala com controle absoluto." subtitle="LocaMed não é um software de registro, é a espinha dorsal da sua operação médica." alignment="left" />
            <div className="grid gap-8">
              {[
                { t: "Redução de Glosas", d: "Toda locação é documentada e cobrada automaticamente, eliminando perdas." },
                { t: "Otimização de Frota", d: "Saiba exatamente onde estão seus ativos e evite a ociosidade de equipamentos." },
                { t: "Fidelização de Parceiros", d: "Pagamentos de comissões pontuais e transparentes via dashboard." },
                { t: "Escalabilidade Operacional", d: "Gerencie 10 ou 1000 poltronas com a mesma precisão e esforço." },
              ].map((b, i) => (
                <div key={i} className="flex gap-6 p-6 rounded-sm border border-transparent hover:border-input transition-all bg-brand-surface/30 hover:bg-brand-surface">
                  <div className="h-6 w-6 rounded-sm bg-brand-navy text-brand-surface flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {i + 1}
                  </div >
                  <div >
                    <h5 className="font-bold text-brand-navy mb-1">{b.t}</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.d}</p>
                  </div >
                </div >
              ))}
            </div >
          </div >
          <div className="relative">
            <div className="aspect-square bg-brand-surface rounded-sm border border-input shadow-2xl p-16 flex items-center justify-center relative overflow-hidden">
               <div className="text-center space-y-4 relative z-10">
                  <div className="text-7xl md:text-8xl font-bold text-brand-navy tracking-tighter">99.9%</div>
                  <div className="text-xs font-black text-primary uppercase tracking-[0.3em]">Precisão Operacional</div>
               </div >
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-10 left-10 w-32 h-32 border border-brand-navy rounded-full"></div >
                  <div className="absolute bottom-20 right-10 w-64 h-64 border border-brand-navy rounded-full"></div >
               </div >
            </div >
          </div >
        </div >
      </section>

      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-navy/5 -z-10"></div >
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-6xl font-bold text-brand-navy tracking-tight leading-tight">
            Pronto para elevar o padrão <br /> da sua operação?
          </h2>
          <p className="text-lg text-muted-foreground opacity-80 max-w-2xl mx-auto leading-relaxed">
            Junte-se às clínicas e empresas de locação que priorizam a precisão técnica, a experiência do paciente e a lucratividade real.
          </p>
          <div className="flex justify-center gap-6 pt-4">
            <Link to="/register" className="px-10 py-5 bg-brand-navy text-brand-surface rounded-sm font-bold text-lg hover:bg-brand-navy/90 transition-all active:scale-[0.98] shadow-premium-lg">
              Começar Implementação Agora
            </Link>
          </div >
        </div >
      </section>

      <footer className="bg-brand-surface border-t border-input py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="space-y-8 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-brand-navy rounded-sm flex items-center justify-center shadow-sm">
                <span className="text-brand-surface font-bold text-xs">LM</span>
              </div >
              <span className="text-xl font-bold tracking-tighter text-brand-navy uppercase">LOcAMed</span>
            </div >
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs opacity-70">
              SaaS de alta precisão para gestão de locações de poltronas médicas e equipamentos pós-cirúrgicos.
            </p>
          </div >
          <div >
            <h4 className="font-bold text-xs uppercase tracking-widest mb-8 text-brand-navy">Produto</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><a href="#modulos" className="hover:text-primary transition-colors">Módulos do Sistema</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Segurança de Dados</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrações API</a></li>
            </ul>
          </div >
          <div >
            <h4 className="font-bold text-xs uppercase tracking-widest mb-8 text-brand-navy">Institucional</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Sobre a LOcAMed</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato Comercial</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
            </ul>
          </div >
          <div >
            <h4 className="font-bold text-xs uppercase tracking-widest mb-8 text-brand-navy">Suporte</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentação Técnica</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status do Sistema</a></li>
            </ul>
          </div >
        </div >
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-input flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
          <p>© {new Date().getFullYear()} LOcAMed Precision. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a>
          </div >
        </div >
      </footer >
    </div >
  );
}
