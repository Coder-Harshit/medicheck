import React from 'react';

interface OperationTimingsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OperationTimings: React.FC<OperationTimingsProps> = ({ formData, handleInputChange }) => {
  return (
    <div>
      <h3 className="font-bold mt-4">Operation Timings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Time of Induction</label>
          <input type="datetime-local" name="timeOfInduction" value={formData.timeOfInduction} onChange={handleInputChange} className="input text-black" />
        </div>
        <div>
          <label>Time of Skin Incision</label>
          <input type="datetime-local" name="timeOfSkinIncision" value={formData.timeOfSkinIncision} onChange={handleInputChange} className="input text-black" />
        </div>
        <div>
          <label>Time of End of Surgery</label>
          <input type="datetime-local" name="timeOfEndSurgery" value={formData.timeOfEndSurgery} onChange={handleInputChange} className="input text-black" />
        </div>
      </div>
    </div>
  );
};

export default OperationTimings;
