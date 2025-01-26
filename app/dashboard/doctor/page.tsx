// app/dashboard/doctor/page.tsx
"use client";
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { SSIFormData as FormData } from '@/app/ssiForm/ssiFormContent';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const DoctorDashboard = () => {
  const { user, userRole, loading } = useUser();
  const router = useRouter();
  const [pendingReviews, setPendingReviews] = useState<FormData[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      if (!user) return;

      const { data, error } = await supabase
          .from('SSI_Form')
          .select('*')
          .eq('status', 'to-be-reviewed');

      if (error) {
        console.error('Error fetching SSI forms:', error);
        return;
      }

      setPendingReviews(data || []);
    };

    fetchPendingReviews();
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <button
              className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg"
              onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Forms Pending Review</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                {/* Add more columns as needed */}
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {pendingReviews.map((form) => (
                  <tr key={form.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{form.patientId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{form.patientName}</td>
                    {/* Add more columns as needed */}
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default DoctorDashboard;