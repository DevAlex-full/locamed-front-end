import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground">Comece a gerir suas poltronas agora mesmo.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome Completo</label>
            <input className="w-full rounded-md border px-3 py-2" type="text" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail</label>
            <input className="w-full rounded-md border px-3 py-2" type="email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Senha</label>
            <input className="w-full rounded-md border px-3 py-2" type="password" />
          </div>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90">Registrar</button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Já possui conta? <Link to="/login" className="text-primary font-medium">Faça Login</Link>
        </p>
      </div>
    </div>
  );
}
