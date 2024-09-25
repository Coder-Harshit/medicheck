import React from 'react';
import { FormData } from './page';
import DropdownBox from '../components/DropdownBox';

interface MicrobiologyDataProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const MicrobiologyData: React.FC<MicrobiologyDataProps> = ({ formData, handleChange }) => {
  const microorganisms = [
    { label: 'Bacteria', value: 'bacteria' },
    { label: 'Virus', value: 'virus' },
    // Add more microorganisms as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mt-4 mb-6 text-center">Microbiology Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Micro-organisms Implicated in SSI</label>
          <DropdownBox
            label="Microorganism 1"
            id="microorganism1"
            name="microorganism1"
            value={formData.microorganisms[0] || ''}
            options={microorganisms}
            onChange={handleChange}
            className="select text-black p-3 rounded-md"
          />
          <DropdownBox
            label="Microorganism 2"
            id="microorganism2"
            name="microorganism2"
            value={formData.microorganisms[1] || ''}
            options={microorganisms}
            onChange={handleChange}
            className="select text-black p-3 rounded-md"
          />
        </div>
        {/* <div className="flex flex-col">
          <label className="mb-2 font-semibold">Secondary BSI contributed to death?</label>
          <input
            type="checkbox"
            name="secondaryBSI"
            checked={formData.secondaryBSI}
            onChange={handleChange}
            className="mt-2"
          />
        </div> */}
      </div>
    </div>
  );
};

export default MicrobiologyData;
