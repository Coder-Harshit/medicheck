"use client";

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import DropdownBox from '@/components/DropdownBox';
import InputBox from '@/components/InputBox';

const AdminDashboard = () => {
  const { user, userRole, loading } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user: newUser }, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      // Insert user role
      const { error: roleError } = await supabase
        .from('user_role')
        .insert([{ user_id: newUser?.id, role }]);

      if (roleError) throw roleError;

      alert('User created successfully');
      setEmail('');
      setPassword('');
      setRole('');
    } catch (error) {
      alert((error as Error).message);
    }
  };

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

    if (userRole?.role === 'admin') {
      return (
        <div>
          <h1>Create New User</h1>
          <form onSubmit={handleCreateUser}>
            <div>
              <label>Email:</label>
              <InputBox
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                id="email"
                className='w-full text-right'
                autoComplete="on"
              />
            </div>
            <div>
              <label>Password:</label>
              <InputBox
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                className="w-full text-right"
                id="password"
                autoComplete="new-password"
              />
            </div>
            <div>
              <DropdownBox
                label='Role'
                id='role'
                name='role'
                options={[
                  { value: 'doctor', label: 'Doctor' },
                  { value: 'nurse', label: 'Nurse' },
                ]}
                className='select p-3 rounded-md'
              />


              {/* <label>Role:</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              /> */}
            </div>
            <button type="submit">Create User</button>
          </form >
        </div >
      );
    } else {
      // Redirect to the appropriate dashboard based on role
      if (userRole) {
        switch (userRole.role) {
          case 'doctor':
            router.push('/dashboard/doctor');
            break;
          case 'nurse':
            router.push('/dashboard/nurse');
          default:
            router.push('/dashboard'); // Default case: redirect to generic dashboard
        }
      } else {
        router.push('/login'); // If no role is found, redirect to login
      }
      return null; // Prevent rendering while navigation happens
    }
  }

  return <div>Unauthorized</div>;
};

export default AdminDashboard;
