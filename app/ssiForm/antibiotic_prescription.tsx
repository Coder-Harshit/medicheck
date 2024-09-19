import React from 'react';

interface AntibioticPrescriptionProps {
  formData: any;
  handleAntibioticChange: (index: number, name: string, value: string) => void;
}

const AntibioticPrescription: React.FC<AntibioticPrescriptionProps> = ({ formData, handleAntibioticChange }) => {
  return (
    <div>
      <h3 className="font-bold mt-4">Antibiotic Prescription</h3>
      {formData.antibiotics.map((antibiotic: any, index: number) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label>Antibiotic Given Prior to Operation</label>
            <input
              type="text"
              value={antibiotic.antibiotic}
              onChange={(e) => handleAntibioticChange(index, 'antibiotic', e.target.value)}
              className="input text-black"
            />
          </div>
          <div>
            <label>Route of Administration</label>
            <select value={antibiotic.route} onChange={(e) => handleAntibioticChange(index, 'route', e.target.value)} className="select text-black">
              <option value="">Select Route</option>
              {/* Add route options */}
            </select>
          </div>
          <div>
            <label>Duration (mins)</label>
            <input
              type="number"
              value={antibiotic.duration}
              onChange={(e) => handleAntibioticChange(index, 'duration', e.target.value)}
              className="input text-black"
            />
          </div>
          <div>
            <label>No. of Doses</label>
            <input
              type="number"
              value={antibiotic.doses}
              onChange={(e) => handleAntibioticChange(index, 'doses', e.target.value)}
              className="input text-black"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AntibioticPrescription;
