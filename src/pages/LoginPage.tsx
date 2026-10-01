import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthContext } from '@/app/providers/AuthContext';
import { toast } from 'sonner';

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
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-red-500">Erro: AuthContext não encontrado. Verifique o AuthProvider.</div>
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
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">Entre com suas credenciais para acessar o sistema.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail</label>
            <input 
              {...register('email')}
              className={`w-full rounded-md border px-3 py-2 ${errors.email ? 'border-red-500' : ''}`} 
              type="email" 
              placeholder="seu@email.com" 
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Senha</label>
            <input 
              {...register('password')}
              className={`w-full rounded-md border px-3 py-2 ${errors.password ? 'border-red-500' : ''}`} 
              type="password" 
              placeholder="******" 
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Entrar
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta? <Link to="/register" className="text-primary font-medium">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
