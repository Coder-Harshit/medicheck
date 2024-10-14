"use client";

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import ReactModal from 'react-modal';
import InputBox from '@/components/InputBox';

const AdminPage = () => {
  const { user, userRole, loading } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user in authentication
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
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect to login page or update UI state
      router.push('/login');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  if (user) {
    if (loading) return <div>Loading...</div>;

    if (userRole?.role === 'admin') {
      return (
        <div>
          <h1>Admin Dashboard</h1>
          <button onClick={() => setIsModalOpen(true)}>Create New User</button>
          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Create New User"
          >
            <h2>Create New User</h2>
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
                  className="w-full text-right"
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
                  id="password"
                  className="w-full text-right"
                  autoComplete="on"
                />
              </div>
              <div>
                <label>Role:</label>
                <InputBox
                  type="text"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  name="role"
                  id="role"
                  className="w-full text-right"
                  autoComplete="on"
                />
              </div>
              <button type="submit">Create User</button>
            </form>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </ReactModal>
        </div>
      );
    }

    return <div>Unauthorized</div>;
  }

  return <div>Loading...</div>;
};

export default AdminPage;