"use client";

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import React from 'react';
// import Link from 'next/link';
// import SSISurveillanceForm from '@/app/ssiForm/page';

const NurseDashboard = () => {
  const { userRole, loading } = useUser();
  const router = useRouter();

  const handleSSIForm = () => {
    router.push('/ssiForm');
  }

  if (loading) return <div>Loading...</div>;

  if (userRole?.role === 'nurse') {
    return (
      <div>
        <button
          className='bg-indigo-500 text-white hover:bg-indigo-600 w-max px-4 py-2 rounded-lg m-2'
          onClick={handleSSIForm}>
          Click to Add SSI Form
        </button>
      </div>
    );
  } else {
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
};

export default NurseDashboard;
