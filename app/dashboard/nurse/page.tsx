"use client";

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import React from 'react';

const nurseDashboard = () => {
  const { user, userRole, loading } = useUser();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;

  if (userRole?.role === 'nurse') {
    return <div>nurseDashboard</div>;
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

export default nurseDashboard;
