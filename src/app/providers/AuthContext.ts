import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { UserData, CompanyBasic } from '@/shared/types'

// Separado em arquivo proprio para evitar o warning react-refresh/only-export-components:
// AuthProvider.tsx exporta apenas o componente; AuthContext e exportado aqui.

export interface AuthContextValue {
  session: Session | null
  user:    UserData | null
  company: CompanyBasic | null
  loading: boolean
  signIn:  (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
