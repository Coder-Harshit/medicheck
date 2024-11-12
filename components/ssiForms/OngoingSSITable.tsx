import { useRouter } from 'next/navigation';
import { FormData } from '@/app/ssiForm/page';
import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { supabase } from '@/utils/supabase/client';

interface OngoingSSITableProps {
  data: FormData[];
}

const OngoingSSITable: React.FC<OngoingSSITableProps> = ({ data }) => {
  // const [currentPage, setCurrentPage] = useState(0);
  const [currentPage] = useState(0);
  // const [pageSize, setPageSize] = useState(10);
  const [pageSize] = useState(10);
  const router = useRouter();

  const columns: { Header: string; accessor: keyof FormData }[] = [
    {
      Header: 'Patient Name',
      accessor: 'patientName'
    },
    {
      Header: 'Patient ID',
      accessor: 'patientId'
    },
    {
      Header: 'Status',
      accessor: 'status'
    },
  ];

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  // const handlePageSizeChange = (size: number) => {
  //   setPageSize(size);
  //   setCurrentPage(0); // Reset to the first page when page size changes
  // };

  const handleRowClick = (id: string) => {
    router.push(`/ssiForm/${id}`);
    // router.push(`/ssiForm/edit/${id}`);
  };

  const handleSSIForm = async () => {
    // Fetch the last patientId from the database
    const { data, error } = await supabase
        .from('SSI_Form')
        .select('patientId')
        .order('patientId', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching patientId:', error);
        alert('Failed to fetch the last patient ID.');
        return;
    }

    // Determine the newId based on the last patientId in the database
    const lastId = data && data.length > 0 ? parseInt(data[0].patientId) : 0;
    const newId = lastId + 1;
    // router.push(`/ssiForm/${newId}`);
    router.push(`/ssiForm?formId=${newId}`);
  };

  const paginatedData = data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className="card overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2><b>Ongoing SSI Forms</b></h2>
        <button className="btn-primary" onClick={handleSSIForm}>
          New Form
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.Header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row) => (
              <tr key={row.patientId} // Ensure each row has a unique key
                onClick={() => handleRowClick(row.patientId)}
                className="hover:bg-gray-100 cursor-pointer transition-colors duration-150"
              >
                {columns.map((column) => (
                  <td key={column.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[column.accessor].toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Improved pagination UI */}
    </div>
  );
};

export default OngoingSSITable;
