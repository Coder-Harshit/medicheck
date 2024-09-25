import React from 'react';
import { FormData } from './page';


interface AntibioticPrescriptionProps {
  formData: FormData;
  handleAntibioticChange: (index: number, name: string, value: string) => void;
  addAntibiotic: () => void;
  removeAntibiotic: () => void;
}

const AntibioticPrescription: React.FC<AntibioticPrescriptionProps> = ({ formData, handleAntibioticChange, addAntibiotic, removeAntibiotic }) => {
  return (
    <div className="container mx-auto p-4 rounded-lg section_box">
      <h3 className="text-2xl font-bold mt-4 mb-6 text-center">Antibiotic Prescription</h3>
      {formData.antibiotics.map((antibiotic, index: number) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 p-4 border rounded-lg shadow-md">
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Antibiotic Given Prior to Operation</label>
            <input
              type="text"
              value={antibiotic.antibiotic}
              onChange={(e) => handleAntibioticChange(index, 'antibiotic', e.target.value)}
              className="input text-black p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Route of Administration</label>
            <select
              value={antibiotic.route}
              onChange={(e) => handleAntibioticChange(index, 'route', e.target.value)}
              className="select text-black p-2 border rounded"
            >
              <option value="">Select Route</option>
              {/* Add route options */}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">Duration (mins)</label>
            <input
              type="number"
              value={antibiotic.duration}
              onChange={(e) => handleAntibioticChange(index, 'duration', e.target.value)}
              className="input text-black p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-semibold">No. of Doses</label>
            <input
              type="number"
              value={antibiotic.doses}
              onChange={(e) => handleAntibioticChange(index, 'doses', e.target.value)}
              className="input text-black p-2 border rounded"
            />
          </div>
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button
          onClick={removeAntibiotic}
          className="bg-red-500 text-white p-2 rounded"
        >
          Remove Antibiotic
        </button>
        <button
          onClick={addAntibiotic}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Antibiotic
        </button>

      </div>
    </div>
  );
};

export default AntibioticPrescription;
