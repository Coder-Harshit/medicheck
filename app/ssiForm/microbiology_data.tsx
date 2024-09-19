import React from 'react';

interface FormData {
  microorganisms: string[];
  secondaryBSI: boolean;
}

interface MicrobiologyDataProps {
  formData: FormData;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDropdownChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const MicrobiologyData: React.FC<MicrobiologyDataProps> = ({ formData, handleCheckboxChange }) => {
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
          <div className="flex flex-col space-y-2">
            {microorganisms.map((microorganism) => (
              <label key={microorganism.value} className="flex items-center">
                <input
                  type="checkbox"
                  name="microorganisms"
                  value={microorganism.value}
                  checked={formData.microorganisms.includes(microorganism.value)}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {microorganism.label}
              </label>
            ))}
          </div>
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
