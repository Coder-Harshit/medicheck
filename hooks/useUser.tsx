import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

interface UserRole {
  id: string;
  email: string;
  role: 'doctor' | 'nurse' | 'admin';
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [userID, setUserID] = useState<string>('')

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, email, role')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user role:', error.message)
        return null
      }

      setUserRole(data)
      return data
    } catch (error) {
      console.error('Error in fetchUserRole:', error)
      return null
    }
  }

  useEffect(() => {
    // Set loading true at the start of the effect
    setLoading(true)

    // Function to handle session updates
    const handleSessionUpdate = async (session: User | null) => {
      try {
        if (session) {
          setUser(session)
          setUserID(session.id)
          const role = await fetchUserRole(session.id)
          if (!role) {
            console.error('Failed to fetch user role for user:', session.id)
          }
        } else {
          setUser(null)
          setUserRole(null)
          setUserID('')
        }
      } catch (error) {
        console.error('Error in handleSessionUpdate:', error)
      } finally {
        setLoading(false)
      }
    }

    // Initial session check
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        await handleSessionUpdate(session?.user ?? null)
      } catch (error) {
        console.error('Error checking initial session:', error)
        setLoading(false)
      }
    }

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user)
      await handleSessionUpdate(session?.user ?? null)
    })

    // Initialize
    initializeSession()

    // Cleanup
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, userRole, loading, userID }
}