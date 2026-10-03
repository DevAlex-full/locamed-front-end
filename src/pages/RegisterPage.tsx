import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-background p-6 font-sans">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-10 space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-navy shadow-premium mb-2">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-brand-navy tracking-tight">Poltronas Med</h2>
          <p className="text-[10px] text-brand-slate uppercase tracking-widest font-medium">Luxury Medical SaaS</p>
        </div>
      </div>

      <Card className="w-full max-w-md border-slate-200 shadow-premium-lg">
        <CardContent className="p-8 pt-6">
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-2xl font-semibold text-brand-navy tracking-tight">Crie sua conta</h1>
            <p className="text-sm text-brand-slate">Comece a gerir suas poltronas com precisão e elegância.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-brand-slate uppercase tracking-wider">
                Nome Completo
              </label>
              <Input type="text" placeholder="Ex: Dr. Alex Bueno" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-brand-slate uppercase tracking-wider">
                E-mail Corporativo
              </label>
              <Input type="email" placeholder="nome@empresa.com" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-brand-slate uppercase tracking-wider">
                Senha de Acesso
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <Button variant="primary" className="w-full py-6 text-sm">
              Finalizar Cadastro
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-brand-slate">
              Já possui conta?{' '}
              <Link to="/login" className="text-brand-blue font-semibold hover:text-brand-navy transition-colors">
                Faça Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
