// FILE: app/dashboard/nurse/page.tsx

"use client";

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import OngoingSSITable from '@/components/ssiForms/OngoingSSITable';
import { FormData } from '@/app/ssiForm/page';

const NurseDashboard = () => {
  const { user, userRole, loading } = useUser();
  const router = useRouter();
  const [ssiForms, setSsiForms] = useState<FormData[]>([]);

  // Handle authentication and role-based routing
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (user && userRole && userRole.role !== 'nurse') {
        switch (userRole.role) {
          case 'doctor':
            router.push('/dashboard/doctor');
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

  // Fetch SSI forms
  useEffect(() => {
    const fetchSSIForms = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('SSI_Form')
        .select('*')
        .eq('nuid', user.id)
        .eq('status', 'ongoing');
        
      if (error) {
        console.error('Error fetching SSI forms:', error);
      } else {
        setSsiForms(data);
      }
    };

    fetchSSIForms();
  }, [user]);


  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  // Show loading state
  if (loading) return <div>Loading...</div>;

  // Show nurse dashboard only if user is authenticated and has nurse role
  if (user && userRole?.role === 'nurse') {
    return (
      <div>
        <OngoingSSITable data={ssiForms}/>
        <div className='flex flex-row py-10'>
            <div className='flex justify-center w-full'>
            <button
              className='bg-red-500 text-white hover:bg-red-600 w-max px-4 py-2 rounded-lg m-2'
              onClick={handleLogout}
            >
              Logout
            </button>
            </div>
          {/* <button
            className='bg-indigo-500 text-white hover:bg-indigo-600 w-max px-4 py-2 rounded-lg m-2'
            onClick={handleSSIForm}
          >
            Click to Add SSI Form
          </button> */}
        </div>
      </div>
    );
  }

  // Show loading state while redirect happens
  return <div>Loading...</div>;
};

export default NurseDashboard;