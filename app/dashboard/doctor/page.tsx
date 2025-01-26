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

  // Fetch SSI forms that need review
  useEffect(() => {
    const fetchPendingReviews = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('SSI_Form')
        .select('*')
        .eq('status', 'to-be-reviewed');
        
      if (error) {
        console.error('Error fetching SSI forms:', error);
      } else {
        setPendingReviews(data);
      }
    };

    fetchPendingReviews();
  }, [user]);

  const flattenData = (data: any) => {
    return data.map((item: any) => {
      const flattenedItem: any = { ...item };

      // Flatten antibioticPrescriptions
      if (item.antibioticPrescriptions) {
        flattenedItem.antibioticPrescriptions = item.antibioticPrescriptions.map((prescription: any) => `${prescription.name} (${prescription.stage}, ${prescription.dose}mg, ${prescription.route}, ${prescription.duration} days)`).join('; ');
      }

      // Flatten SSIEvalCheckList
      if (item.SSIEvalCheckList) {
        flattenedItem.SSIEvalCheckList = item.SSIEvalCheckList.map((checklistItem: any) => `${checklistItem.item}: ${checklistItem.yesNo ? 'Yes' : 'No'} (${checklistItem.remark})`).join('; ');
      }

      // Flatten isolate1 and isolate2
      if (item.isolate1) {
        flattenedItem.isolate1 = `Sensitive: ${item.isolate1.sensitive.join(', ')}, Resistant: ${item.isolate1.resistant.join(', ')}, Intermediate: ${item.isolate1.intermediate.join(', ')}`;
      }
      if (item.isolate2) {
        flattenedItem.isolate2 = `Sensitive: ${item.isolate2.sensitive.join(', ')}, Resistant: ${item.isolate2.resistant.join(', ')}, Intermediate: ${item.isolate2.intermediate.join(', ')}`;
      }

      // Flatten symptomsDict
      if (item.symptomsDict) {
        flattenedItem.symptomsDict = Object.entries(item.symptomsDict).map(([symptom, days]) => {
          return `${symptom}: ${Object.entries(days).map(([day, val]) => `Day ${day}: ${val ? 'Yes' : 'No'}`).join(', ')}`;
        }).join('; ');
      }

      return flattenedItem;
    });
  };
  
  const exportToCSV = async () => {
    setIsExporting(true);
    try {
        const response = await fetch('/api/exportPatients');
        const data = await response.json();
        const flattenedData = flattenData(data);
        const csv = Papa.unparse(flattenData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'all_patients_data.csv');
    } catch (error) {
        console.error('Error exporting data:', error);
    } finally {
        setIsExporting(false);
    }
};
  const handleViewForm = (patientId: string) => {
    router.push(`/ssiForm/?formId=${patientId}&mode=review`);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (user && userRole?.role === 'doctor') {
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submission Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingReviews.map((form) => (
                  <tr key={form.patientId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{form.patientId}</td>
                    <td className="px-6 py-4">{form.patientName}</td>
                    <td className="px-6 py-4">{new Date(form.dateOfProcedure).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewForm(form.patientId)}
                        className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={exportToCSV} disabled={isExporting}>
                {isExporting ? 'Exporting...' : 'Export All Patients to CSV'}
            </button>
        </div>
      </div>
    );
  }

  return <div>Unauthorized</div>;
};

export default DoctorDashboard;