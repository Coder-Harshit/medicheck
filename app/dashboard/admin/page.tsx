// FILE: app/dashboard/page.tsx

"use client";

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import ReactModal from 'react-modal';

const AdminPage = () => {
  const { user, userRole, loading } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      // Create user in authentication
      const { data: { user: newUser }, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Insert user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ 
          'id': newUser?.id,
          email,
          role,
        }
      ]);

      if (roleError) throw roleError;

      // Show success message
      alert('User created successfully');
      // Reset form fields
      setEmail('');
      setPassword('');
      setRole('');
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (user && userRole?.role === 'admin') {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg text-black">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Create New User
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Logout
          </button>
        </div>

        {/* Modal for Creating New User */}
        <ReactModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Create New User"
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          ariaHideApp={false}
        >
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold text-black mb-4">Create New User</h2>
            {errorMessage && (
              <div className="mb-4 text-red-500">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md text-slate-700"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md text-slate-700"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md text-slate-700"
                >
                  <option value="" disabled>Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  {/* Add more roles as needed */}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md mr-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </ReactModal>

      </div>
    );
  }

  // Show loading state while redirect happens
  return <div>Loading...</div>;
};

export default AdminPage;