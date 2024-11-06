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
  const [userID, setUserID] = useState<string>('');

  // useEffect(() => {
  //   async function getInitialSession() {
  //     const { data: { session }, error } = await supabase.auth.getSession()
  //     setUser(session?.user ?? null)
  //     if (session?.user) {
  //       fetchUserRole(session.user.id)
  //       setUserID(session.user.id);
  //     } else {
  //       setLoading(false)
  //       setUserID('');
  //     }
  //   }

  //   getInitialSession()
  useEffect(() => {
    // Fetch initial session only once
    const fetchInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
      }

      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        await fetchUserRole(sessionUser.id);
        setUserID(sessionUser.id);
      }

      setLoading(false);
    };

    fetchInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      
      if (sessionUser) {
        setUserID(sessionUser.id)
        fetchUserRole(sessionUser.id)
      } else {
        setUserRole(null)
        setUserID('')
      }
      setLoading(false)
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

  return { user, userRole, loading, userID }
}
