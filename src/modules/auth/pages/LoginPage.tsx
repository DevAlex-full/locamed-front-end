import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { z } from 'zod'
import { useAuth } from '@/shared/hooks/useAuth'
import { cn } from '@/lib/utils'

// =============================================================================
// LoginPage — Autenticacao com Supabase Auth
// =============================================================================
//
// Fluxo:
//   1. Usuario preenche email e senha
//   2. RHF valida com Zod antes de submeter
//   3. signIn() chama supabase.auth.signInWithPassword()
//   4. Supabase dispara onAuthStateChange → AuthProvider chama GET /me
//   5. AuthProvider popula user + company no contexto
//   6. navigate('/') leva ao dashboard (ProtectedRoute libera o acesso)
//
// Erros mapeados:
//   "Invalid login credentials"  → "E-mail ou senha incorretos."
//   "Email not confirmed"         → "Confirme seu e-mail antes de entrar."
//   "Too many requests"           → "Muitas tentativas. Aguarde alguns minutos."
//   outros                        → mensagem original do Supabase (fallback)
// =============================================================================

// ── Schema de validacao ───────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail obrigatorio')
    .email('Digite um e-mail valido'),
  password: z
    .string()
    .min(1, 'Senha obrigatoria')
    .min(6, 'Senha deve ter no minimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

// ── Mapeamento de erros do Supabase para PT-BR ────────────────────────────────
function mapSupabaseError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.'
  }
  if (lower.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'
  }
  if (lower.includes('too many requests') || lower.includes('rate limit')) {
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Erro de conexao. Verifique sua internet e tente novamente.'
  }
  // Fallback: exibir mensagem original se nao mapeada
  return message
}

// ── Componentes de UI inline ─────────────────────────────────────────────────
// Nao dependem de shadcn instalado — built com Tailwind puro

interface InputFieldProps {
  id:           string
  label:        string
  type:         string
  placeholder:  string
  autoComplete: string
  error?:       string
  disabled?:    boolean
  rightSlot?:   React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration: any
}

function InputField({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  error,
  disabled,
  rightSlot,
  registration,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'w-full rounded-md border bg-background px-3 py-2.5 text-sm',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-150',
            error
              ? 'border-destructive focus:ring-destructive'
              : 'border-input hover:border-ring',
            rightSlot ? 'pr-10' : '',
          )}
          {...registration}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

// ── Pagina de Login ───────────────────────────────────────────────────────────
export function LoginPage() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const [showPassword,  setShowPassword]  = useState(false)
  const [authError,     setAuthError]     = useState<string | null>(null)
  const [isSubmitting,  setIsSubmitting]  = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver:      zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null)
    setIsSubmitting(true)

    try {
      await signIn(data.email, data.password)
      // signIn dispara onAuthStateChange → AuthProvider busca /me automaticamente
      navigate('/', { replace: true })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido.'
      setAuthError(mapSupabaseError(message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Cabecalho */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-primary-foreground"
              aria-hidden="true"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Poltronas Med
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema de Locacao Pos-Cirurgica
          </p>
        </div>

        {/* Card do formulario */}
        <div className="rounded-xl border bg-card shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">
              Entrar na sua conta
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Use suas credenciais de acesso
            </p>
          </div>

          {/* Erro de autenticacao */}
          {authError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 mb-5"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 text-destructive mt-0.5 shrink-0"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-destructive">{authError}</p>
            </div>
          )}

          {/* Formulario */}
          <form
            onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}
            noValidate
            className="space-y-5"
          >
            <InputField
              id="email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              error={errors.email?.message}
              disabled={isSubmitting}
              registration={register('email')}
            />

            <InputField
              id="password"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              disabled={isSubmitting}
              registration={register('password')}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </button>
              }
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full flex items-center justify-center gap-2',
                'rounded-md bg-primary px-4 py-2.5',
                'text-sm font-medium text-primary-foreground',
                'hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-60',
                'transition-all duration-150',
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" aria-hidden />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Rodape */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Em caso de problemas de acesso, contate o administrador do sistema.
        </p>

      </div>
    </div>
  )
}