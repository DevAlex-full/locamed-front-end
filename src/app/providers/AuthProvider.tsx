import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AuthContext } from './AuthContext'
import { supabase } from '@/shared/lib/supabase'
import { api } from '@/shared/api/client'
import type { UserData, CompanyBasic, MeResponse, ApiSuccess } from '@/shared/types'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [user,    setUser]    = useState<UserData | null>(null)
  const [company, setCompany] = useState<CompanyBasic | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const response = await api.get<ApiSuccess<MeResponse>>('/me')
      setUser(response.data.data.user)
      setCompany(response.data.data.company)
    } catch {
      await supabase.auth.signOut()
      setUser(null)
      setCompany(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initSession = async () => {
      const { data: { session: current } } = await supabase.auth.getSession()
      setSession(current)
      if (current) {
        await fetchMe()
      } else {
        setLoading(false)
      }
    }

    void initSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        if (newSession) {
          void fetchMe()
        } else {
          setUser(null)
          setCompany(null)
          setLoading(false)
        }
      },
    )

    return () => { subscription.unsubscribe() }
  }, [fetchMe])

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      throw error
    }
  }

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user, company, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
