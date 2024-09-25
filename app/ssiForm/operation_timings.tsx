import React from 'react';
import { FormData } from './page';


interface OperationTimingsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OperationTimings: React.FC<OperationTimingsProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mt-4 mb-6 text-center">Operation Timings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Time of Induction</label>
          <input
            type="datetime-local"
            name="timeOfInduction"
            value={formData.timeOfInduction}
            onChange={handleInputChange}
            className="input text-black p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Time of Skin Incision</label>
          <input
            type="datetime-local"
            name="timeOfSkinIncision"
            value={formData.timeOfSkinIncision}
            onChange={handleInputChange}
            className="input text-black p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">Time of End of Surgery</label>
          <input
            type="datetime-local"
            name="timeOfEndSurgery"
            value={formData.timeOfEndSurgery}
            onChange={handleInputChange}
            className="input text-black p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default OperationTimings;
