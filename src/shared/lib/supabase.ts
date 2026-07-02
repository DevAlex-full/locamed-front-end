import { createClient } from '@supabase/supabase-js'

// =============================================================================
// Supabase Client — Frontend (Auth Only)
// =============================================================================
//
// Usa apenas a ANON KEY — chave publica segura para o browser.
// NUNCA use a SERVICE_ROLE_KEY no frontend.
//
// Responsabilidades:
//   - Login / logout via Supabase Auth
//   - Gerenciamento de sessao e refresh token automatico
//   - Escuta de mudancas de autenticacao (onAuthStateChange)
// =============================================================================

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession:     true,
    autoRefreshToken:   true,
    detectSessionInUrl: true,
  },
})