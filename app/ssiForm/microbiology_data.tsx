import React from 'react';

interface MicrobiologyDataProps {
  formData: any;
  handleDropdownChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MicrobiologyData: React.FC<MicrobiologyDataProps> = ({ formData, handleDropdownChange, handleCheckboxChange }) => {
  return (
    <div>
      <h3 className="font-bold mt-4">Microbiology Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Micro-organisms Implicated in SSI</label>
          <select name="microorganisms" multiple={true} value={formData.microorganisms} onChange={handleDropdownChange} className="select text-black">
            {/* Add options for microorganisms */}
          </select>
        </div>
        <div>
          <label>Secondary BSI contributed to death?</label>
          <input type="checkbox" name="secondaryBSI" checked={formData.secondaryBSI} onChange={handleCheckboxChange} />
        </div>
      </div>
    </div>
  );
};

export default MicrobiologyData;
