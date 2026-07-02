import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from '@/app/providers/AuthContext'

// =============================================================================
// useAuth — Hook para consumir o AuthContext
// =============================================================================
//
// Lanca erro se usado fora do AuthProvider (falha rapida em dev).
//
// Uso:
//   const { user, company, loading, signIn, signOut } = useAuth()
// =============================================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }
  return context
}