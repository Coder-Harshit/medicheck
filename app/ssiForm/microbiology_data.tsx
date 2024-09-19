import React from 'react';

interface MicrobiologyDataProps {
  formData: any;
  handleDropdownChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MicrobiologyData: React.FC<MicrobiologyDataProps> = ({ formData, handleDropdownChange, handleCheckboxChange }) => {
  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mt-4 mb-6 text-center">Microbiology Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Micro-organisms Implicated in SSI</label>
          <select
            name="microorganisms"
            multiple={true}
            value={formData.microorganisms}
            onChange={handleDropdownChange}
            className="select text-black p-2 border rounded"
          >
            {/* Add options for microorganisms */}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Secondary BSI contributed to death?</label>
          <input
            type="checkbox"
            name="secondaryBSI"
            checked={formData.secondaryBSI}
            onChange={handleCheckboxChange}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default MicrobiologyData;
