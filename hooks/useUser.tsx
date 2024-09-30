import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface UserRole {
  id: string;
  email: string;
  role: 'doctor' | 'nurse';
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getInitialSession() {
      const { data: { session }, error } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)
      } else {
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRole(session.user.id)
      } else {
        setUserRole(null)
        setLoading(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, email, role')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUserRole(data)
    } catch (error) {
      console.error('Error fetching user role:', (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return { user, userRole, loading }
}
