import React from 'react';
import { FormData } from './page';
import InputBox from '../components/InputBox';
import DropdownBox from '../components/DropdownBox';
import DateTimePickerBox from '../components/DateTimePickerBox';


interface AntibioticPrescriptionProps {
  formData: FormData;
  handleAntibioticChange: (index: number, name: string, value: string) => void;
  addAntibiotic: () => void;
  removeAntibiotic: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const AntibioticPrescription: React.FC<AntibioticPrescriptionProps> = ({ formData, handleAntibioticChange, addAntibiotic, removeAntibiotic, handleChange }) => {
  return (
    <div className="container mx-auto p-4 rounded-lg section_box">
      <h3 className="text-2xl font-bold mt-4 mb-6 text-center">Antibiotic Prescription</h3>
      {formData.antibiotics.map((antibiotic, index: number) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 p-4 border rounded-lg shadow-md">
          <div className="flex flex-col">
            {/* <label className="mb-2 font-semibold">Antibiotic Given Prior to Operation</label> */}
            <InputBox
              label='Antibiotic Given Prior to Operation'
              labelClass='font-semibold'
              value={antibiotic.antibiotic}
              onChange={(e) => handleAntibioticChange(index, 'antibiotic', e.target.value)}
              className="input rounded"
              id={'abprior'}
              name={'abprior'}
            />
          </div>
          <div className="flex flex-col">
            {/* <label className="mb-2 font-semibold">Route of Administration</label>
            <select
              value={antibiotic.route}
              onChange={(e) => handleAntibioticChange(index, 'route', e.target.value)}
              className="select text-black p-2 border rounded"
            >
              <option value="">Select Route</option>
              <option value="IV">IV</option>
              <option value="Oral">Oral</option>
              <option value="IM">IM</option>
            </select> */}
            <DropdownBox
              label='Route of Administration'
              labelClass={'font-semibold'}
              value={antibiotic.route}
              onChange={(e) => handleAntibioticChange(index, 'route', e.target.value)}
              className="select rounded"
              options={[
                { value: '', label: 'Select Route' },
                { value: 'IV', label: 'IV' },
                { value: 'Oral', label: 'Oral' },
                { value: 'IM', label: 'IM' },
              ]}
              id={'route'}
              name={'route'}
            />

          </div>
          <div className="flex flex-col">
            {/* <label className="mb-2 font-semibold">Duration (mins)</label>
            <input
              type="number"
              value={antibiotic.duration}
              onChange={(e) => handleAntibioticChange(index, 'duration', e.target.value)}
              className="input text-black p-2 border rounded"
            /> */}
            <InputBox
              label='Duration (mins)'
              labelClass='font-semibold'
              type="number"
              value={antibiotic.duration}
              id={'duration'}
              name={'duration'}
              onChange={(e) => handleAntibioticChange(index, 'duration', e.target.value)}
              className="input rounded"
            />
          </div>
          <div className="flex flex-col">
            {/* <label className="mb-2 font-semibold">No. of Doses</label>
            <input
              type="number"
              value={antibiotic.doses}
              onChange={(e) => handleAntibioticChange(index, 'doses', e.target.value)}
              className="input text-black p-2 border rounded"
            /> */}
            <InputBox
              label='No. of Doses'
              labelClass='font-semibold'
              type="number"
              value={antibiotic.doses}
              onChange={(e) => handleAntibioticChange(index, 'doses', e.target.value)}
              className="input rounded"
              id={'doses'}
              name={'doses'}
            />
          </div>
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button
          type='button'
          onClick={removeAntibiotic}
          className="bg-red-500 text-white p-2 rounded"
        >
          Remove Antibiotic
        </button>
        <button
          type='button'
          onClick={addAntibiotic}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Antibiotic
        </button>
      </div>
      <div className="flex">
        <div className="p-3 m-2 w-full">
          {/* Time of Induction */}
          <DateTimePickerBox
            label="Time of Induction"
            // labelClass=""
            id="ind"
            name="ind"
            value={formData.timeOfInduction}
            onChange={handleChange}
            className="input p-3 rounded-md"
            type='time'
          />

        </div>
        <div className="p-3 m-2 w-full">
          {/* Time of Incision */}
          <DateTimePickerBox
            label="Time of Incision"
            // labelClass=""
            id="inc"
            name="inc"
            value={formData.timeOfSkinIncision}
            onChange={handleChange}
            className="input p-3 rounded-md"
            type='time'
          />
        </div>
        <div className="p-3 m-2 w-full">

          {/* End time of Surgery */}
          <DateTimePickerBox
            label="End time of Surgery"
            // labelClass=""
            id="eos"
            name="eos"
            value={formData.timeOfEndSurgery}
            onChange={handleChange}
            className="input p-3 rounded-md"
            type='time'
          />
        </div>


      </div>
    </div>
  );
};

export default AntibioticPrescription;
