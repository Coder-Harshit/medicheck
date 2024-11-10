"use client";

// import React from 'react'
// import { useUser } from '@/hooks/useUser'

// function DashBoard() {
//   const { user, userRole, loading } = useUser()

//   if (loading) return <div>Loading...</div>
//   if (!user) return <div>Please log in</div>

//   return (
//     <div>
//       <h1>Welcome, {user.email}</h1>
//       <p>Your role is: {userRole?.role}</p>
//       {/* Render role-specific content here */}
//     </div>
//   )
// }

// export default DashBoard
import { useUser } from '@/hooks/useUser'
// import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashBoard() {
  const { user, userRole, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not logged in, redirect to login page
        // <Link href="/login">
        //   <h1>User Not Logged in ... click to go back to Login Page</h1>
        // </Link>
        router.push('/login')
      } else if (userRole) {
        // If role is available, redirect to appropriate dashboard
        switch (userRole.role) {
          case 'doctor':
            // console.log('Welcome %s', user.email)
            // console.log(userRole?.role)
            router.push('/dashboard/doctor')
            break
          case 'nurse':
            // console.log('Welcome %s', user.email)
            // console.log(userRole?.role)
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
