// FILE: app/ssiForm/edit/[id]/page.tsx

'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const EditSSIDraft = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      // Redirect to the SSISurveillanceForm page with the form ID
      router.push(`/ssiForm?formId=${id}`);
    }
    setLoading(false);
  }, [id, router]);

  if (loading) return <div>Loading...</div>;

  return <div>Redirecting...</div>;
};

export default EditSSIDraft;