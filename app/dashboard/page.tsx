"use client";
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashBoard() {
  const { user, userRole, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (userRole) {
        // If role is available, redirect to appropriate dashboard
        switch (userRole.role) {
          case 'doctor':
            router.push('/dashboard/doctor')
            break
          case 'nurse':
            router.push('/dashboard/nurse')
            break
          case 'admin':
            router.push('/dashboard/admin');
            break;
          default:
            // Handle unknown role
            console.error('Unknown user role')
        }
      }
    }
  }, [user, userRole, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }
  // This should not be rendered, as we're always redirecting
  return null
}
