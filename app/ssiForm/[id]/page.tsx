// FILE: app/ssiForm/draft/[id].tsx

'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { FormData } from '@/app/ssiForm/page';

const SSIDetail = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the dynamic id from the URL
  // console.log('ID:', id);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('SSI_Form')
        .select('*')
        .eq('patientId', id)
        .single();

      if (error) {
        console.error('Error fetching SSI form:', error);
      } else {
        setFormData(data);
      }
      setLoading(false);
    };

    fetchFormData();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!formData) return <div>No data found</div>;

  const handleEditDraft = () => {
    router.push(`/ssiForm/edit/${id}`);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-black">
      <h1 className="text-2xl font-bold mb-4">SSI Form Details</h1>
      <p><strong>Patient Name:</strong> {formData.patientName}</p>
      <p><strong>Patient ID:</strong> {formData.patientId}</p>
      <p><strong>Status:</strong> {formData.status}</p>
      {/* Add more fields as necessary */}
      <div className="mt-4">
        {/* <button
          onClick={handleEditDraft}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
        >
          Edit Draft
        </button> */}
        <button
          onClick={handleBackToDashboard}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SSIDetail;