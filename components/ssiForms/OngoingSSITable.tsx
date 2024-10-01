import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

interface OngoingSSITableProps {
  data: any[];
}

const OngoingSSITable: React.FC<OngoingSSITableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to the first page when page size changes
  };

  const paginatedData = data.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 text-left text-gray-600 font-semibold border-b border-gray-200">
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 border-b border-gray-200">
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
          >
            {'<<'}
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50 mx-1"
          >
            {'<'}
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(data.length / pageSize) - 1}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50 mx-1"
          >
            {'>'}
          </button>
          <button
            onClick={() => handlePageChange(Math.ceil(data.length / pageSize) - 1)}
            disabled={currentPage === Math.ceil(data.length / pageSize) - 1}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
          >
            {'>>'}
          </button>
        </div>
        <div className="flex items-center">
          <span className="mr-2">
            Page{' '}
            <strong>
              {currentPage + 1} of {Math.ceil(data.length / pageSize)}
            </strong>{' '}
          </span>
          <select
            value={pageSize}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded-md"
          >
            {[10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default OngoingSSITable;
