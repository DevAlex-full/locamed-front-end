import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthContext } from '@/app/providers/AuthContext';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background p-6">
        <div className="text-status-error">Erro: AuthContext não encontrado. Verifique o AuthProvider.</div>
      </div>
    );
  }

  const { signIn } = auth;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Ocorreu um erro ao tentar fazer login.');
    }
  };

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
            <h1 className="text-2xl font-semibold text-brand-navy tracking-tight">Bem-vindo de volta</h1>
            <p className="text-sm text-brand-slate">Entre com suas credenciais para acessar o sistema.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-brand-slate uppercase tracking-wider">
                E-mail
              </label>
              <Input 
                {...register('email')}
                type="email" 
                placeholder="nome@empresa.com"
                className={errors.email ? 'border-status-error focus-visible:ring-status-error/20' : ''}
              />
              {errors.email && <p className="text-[11px] text-status-error font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-brand-slate uppercase tracking-wider">
                  Senha
                </label>
                <a href="#" className="text-[11px] text-brand-blue hover:underline font-medium">Esqueceu a senha?</a>
              </div>
              <Input 
                {...register('password')}
                type="password" 
                placeholder="••••••••"
                className={errors.password ? 'border-status-error focus-visible:ring-status-error/20' : ''}
              />
              {errors.password && <p className="text-[11px] text-status-error font-medium">{errors.password.message}</p>}
            </div>

            <Button type="submit" variant="primary" className="w-full py-6 text-sm">
              Entrar no Sistema
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-brand-slate">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-brand-blue font-semibold hover:text-brand-navy transition-colors">
                Cadastre-se agora
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
