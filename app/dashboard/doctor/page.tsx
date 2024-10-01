"use client";

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import React from 'react';
import { supabase } from '@/utils/supabase/client';

const DoctorDashboard = () => {
  const { user, userRole, loading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      // Redirect to login page or update UI state
      router.push('/login')
    } catch (error) {
      alert((error as Error).message)
    }
  }

  if (user) {

    if (loading) return <div>Loading...</div>;

    if (userRole?.role === 'doctor') {
      return (
        <div>
          DoctorDashboard
          <button
            className='bg-red-500 text-white hover:bg-red-600 w-max px-4 py-2 rounded-lg m-2'
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      );
    } else {
      // Redirect to the appropriate dashboard based on role
      if (userRole) {
        switch (userRole.role) {
          case 'nurse':
            router.push('/dashboard/nurse');
            break;
          default:
            router.push('/dashboard'); // Default case: redirect to generic dashboard
        }
      } else {
        router.push('/login'); // If no role is found, redirect to login
      }
      return null; // Prevent rendering while navigation happens
    }
  }
  return <div>Unauthorized</div>
};

export default DoctorDashboard;
