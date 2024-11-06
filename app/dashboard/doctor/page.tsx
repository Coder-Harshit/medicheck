"use client";

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

const DoctorDashboard = () => {
  const { user, userRole, loading } = useUser();
  const router = useRouter();

  // Handle authentication and role-based routing
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (user && userRole && userRole.role !== 'doctor') {
        switch (userRole.role) {
          case 'nurse':
            router.push('/dashboard/nurse');
            break;
          case 'admin':
            router.push('/dashboard/admin');
            break;
          default:
            router.push('/dashboard');
            break;
        }
      }
    }
  }, [user, userRole, loading, router]);



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

  if (loading) return <div>Loading...</div>;

  if (user && userRole?.role === 'doctor') {
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
  }
  return <div>Unauthorized</div>
};

export default DoctorDashboard;
