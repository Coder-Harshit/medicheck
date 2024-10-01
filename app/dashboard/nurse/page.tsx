"use client";

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import OngoingSSITable from '@/components/ssiForms/OngoingSSITable';
import { FormData } from '@/app/ssiForm/page';
// import handleLogout from '@/app/logout';

const NurseDashboard = () => {
  const { user, userRole, loading } = useUser();
  const router = useRouter();
  const [ssiForms, setSsiForms] = useState<FormData[]>([]);

  useEffect(() => {
    const fetchSSIFOrms = async () => {
      const { data, error } = await supabase
        .from('SSI_Form')
        .select('*')
        .eq('status', 'ongoing');

      if (error) {
        console.error('Error fetching SSI forms:', error);
      } else {
        setSsiForms(data);
      }
    };

    fetchSSIFOrms();
  }, []);


  const handleSSIForm = () => {
    router.push('/ssiForm');
  }

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

  if (userRole?.role === 'nurse') {
    return (
      <div>
        <OngoingSSITable data={ssiForms} />
        <div className='flex flex-row'>

          <button
            className='bg-red-500 text-white hover:bg-red-600 w-max px-4 py-2 rounded-lg m-2'
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className='bg-indigo-500 text-white hover:bg-indigo-600 w-max px-4 py-2 rounded-lg m-2'
            onClick={handleSSIForm}>
            Click to Add SSI Form
          </button>
        </div>

      </div>
    );
  } else if (user) {
    // Redirect to the appropriate dashboard based on role
    if (userRole) {
      switch (userRole.role) {
        case 'doctor':
          router.push('/dashboard/doctor');
          break;
        default:
          router.push('/dashboard'); // Default case: redirect to generic dashboard
      }
    } else {
      router.push('/login'); // If no role is found, redirect to login
    }
    return null; // Prevent rendering while navigation happens
  }

  return <div>Unauthorized</div>;
};

export default NurseDashboard;
