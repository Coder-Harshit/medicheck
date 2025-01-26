"use client";
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { SSIFormData as FormData } from '@/app/interfaces';
import { exportToCSV } from '@/utils/exportToCSV';
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Loader2, LogOut, Plus } from 'lucide-react';
// import { toast } from "@/hooks/use-toast";
import ExportModal from '@/components/ExportModal';

const DoctorDashboard = () => {
  // const { user, userRole, loading } = useUser();
  const { user, loading } = useUser();
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
      console.log(data);
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

  const handleExport = (filter: 'all' | 'handpicked') => {
    setIsExporting(true);
    if (filter === 'all') {
      exportToCSV(pendingReviews, 'all_patients.csv');
    } else {
      // Implement handpicked filter logic here
      // For now, we'll just export all patients as a placeholder
      exportToCSV(pendingReviews, 'handpicked_patients.csv');
    }
    setIsExporting(false);
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {pendingReviews.map((form) => (
                  <tr key={form.patientId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{form.patientId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{form.patientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/ssiForm?formId=${form.patientId}&mode=review`)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex space-x-4">
            <Button
                className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg"
                onClick={() => handleExport('all')}
                disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export All to CSV'}
            </Button>
            <ExportModal data={pendingReviews} />
          </div>
        </div>
      </div>
  );
};

export default DoctorDashboard;