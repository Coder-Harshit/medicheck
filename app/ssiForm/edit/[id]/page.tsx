// FILE: app/ssiForm/edit/[id]/page.tsx

'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { FormData } from '@/app/ssiForm/page';

const EditSSIDraft = () => {
  const { id } = useParams(); // Get the dynamic id from the URL
  const router = useRouter();
  // const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      // Redirect to the SSISurveillanceForm page with the form ID
      // router.push(`/ssiForm/${id}`);
      router.push(`/ssiForm?formId=${id}`);
    }
    setLoading(false);
  }, [id, router]);

  // useEffect(() => {
  //   const fetchFormData = async () => {
  //     if (!id) return;

  //     const { data, error } = await supabase
  //       .from('SSI_Form')
  //       .select('*')
  //       .eq('patientId', id)
  //       .eq('status', 'ongoing') // Ensure we fetch the draft with 'ongoing' status
  //       .single();

  //     if (error) {
  //       console.error('Error fetching SSI form:', error);
  //     } else {
  //       setFormData(data);
  //       router.push(`/ssiForm/`);
  //     }
  //     setLoading(false);
  //   };

  //   fetchFormData();
  // }, [id, router]);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!formData) return;
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleSave = async () => {
  //   if (!formData) return;

  //   const { error } = await supabase
  //     .from('SSI_Form')
  //     .update(formData)
  //     .eq('patientId', id)
  //     .eq('status', 'ongoing'); // Ensure we update the draft with 'ongoing' status

  //   if (error) {
  //     console.error('Error updating SSI form:', error);
  //   } else {
  //     router.push(`/ssiForm/${id}`);
  //   }
  // };

  if (loading) return <div>Loading...</div>;

  // if (!formData) return <div>No data found</div>;

  return <div>Redirecting...</div>;

  // return (
  //   <div className="p-6 bg-white rounded-lg shadow-lg text-black">
  //     <h1 className="text-2xl font-bold mb-4">Edit SSI Form</h1>
  //     <form>
  //       <div className="mb-4">
  //         <label className="block text-gray-700">Patient Name</label>
  //         <input
  //           type="text"
  //           name="patientName"
  //           value={formData.patientName}
  //           onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
  //           className="w-full px-4 py-2 border rounded-md"
  //         />
  //       </div>
  //       <div className="mb-4">
  //         <label className="block text-gray-700">Status</label>
  //         <input
  //           type="text"
  //           value={formData.status}
  //           onChange={(e) => setFormData({ ...formData, status: e.target.value as "ongoing" | "to-be-reviewed" | "reviewed" })}
  //           className="w-full px-4 py-2 border rounded-md"
  //         />
  //       </div>
  //       {/* Add more fields as necessary */}
  //       <div className="mt-4">
  //         <button
  //           type="button"
  //           onClick={handleSave}
  //           className="px-4 py-2 bg-blue-500 text-white rounded-md"
  //         >
  //           Save
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );
};

export default EditSSIDraft;