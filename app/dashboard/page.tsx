import React from 'react'
import { useUser } from '@/hooks/useUser'

function DashBoard() {
  const { user, userRole, loading } = useUser()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>Your role is: {userRole?.role}</p>
      {/* Render role-specific content here */}
    </div>
  )
}

export default DashBoard
