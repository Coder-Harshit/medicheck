import React from 'react';
import { FormData } from './page';
import DropdownBox from '../components/DropdownBox';

interface MicrobiologyDataProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const MicrobiologyData: React.FC<MicrobiologyDataProps> = ({ formData, handleChange }) => {
  const microorganisms = [
    { label: '----', value: '' },
    { label: 'Bacteria', value: 'bacteria' },
    { label: 'Virus', value: 'virus' },
    // Add more microorganisms as needed
  ];

  return (
    <div className="container mx-auto p-4 rounded-lg section_box">
      <h3 className="text-2xl font-bold mt-4 mb-6 text-center">Microbiology Data</h3>
      <div className="grid grid-cols-3 md:grid-cols-1 gap-10">
        <div className="flex flex-row">
          <label className="font-semibold self-center mx-3 px-3 basis-1/2">Micro-organisms Implicated in SSI</label>
          <DropdownBox
            // label="Microorganism 1"
            id="microorganism1"
            name="microorganism1"
            value={formData.microorganisms[0] || ''}
            options={microorganisms}
            onChange={handleChange}
            className="select text-black py-3 px-6 mx-6 rounded-md w-full"
          />
          <DropdownBox
            // label="Microorganism 2"
            id="microorganism2"
            name="microorganism2"
            value={formData.microorganisms[1] || ''}
            options={microorganisms}
            onChange={handleChange}
            className="select text-black py-3 px-6 mx-6 rounded-md w-full"
          />
        </div>


        {/* Isolate 1 and Isolate 2 Antibiotic Susceptibility Pattern */}
        <div className="grid grid-cols-2 gap-8">
          <IsolateForm label="Isolate-1 (Antibiotic Susceptibility Pattern)" />
          <IsolateForm label="Isolate-2 (Antibiotic Susceptibility Pattern)" />
        </div>

      </div>
    </div>
  );
}



// Component for each Isolate form section
const IsolateForm: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <label className="block text-sm font-semibold mb-2 text-white">
      {label}
    </label>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-xs text-gray-300 mb-2">Sensitive</label>
        <select className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600">
          <option value="">Select</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-300 mb-2">Resistant</label>
        <select className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600">
          <option value="">Select</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-300 mb-2">Intermediate</label>
        <select className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600">
          <option value="">Select</option>
        </select>
      </div>
    </div>
  </div>
);


export default MicrobiologyData;
