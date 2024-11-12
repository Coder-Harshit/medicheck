import React from 'react';
import { FormData } from './page';
import InputBox from '../../components/InputBox';
import DropdownBox from '../../components/DropdownBox';
import DateTimePickerBox from '../../components/DateTimePickerBox';


interface AntibioticPrescriptionProps {
  formData: FormData;
  handleAntibioticChange: (index: number, name: string, value: string) => void;
  addAntibiotic: () => void;
  removeAntibiotic: () => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const AntibioticPrescription: React.FC<AntibioticPrescriptionProps> = ({
  formData,
  handleAntibioticChange,
  addAntibiotic,
  removeAntibiotic,
  handleChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-primary">
        Antibiotic Prescription
      </h3>
      {/* Secondary BSI contributed to Death ? */}
      <DropdownBox
        label="Secondary BSI contributed to Death ?"
        labelClass="truncate"
        id="secondaryBSIdeath"
        name="secondaryBSIdeath"
        value={formData.secondaryBSIdeath ? 'true' : 'false'}
        options={[
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' },
        ]}
        onChange={handleChange}
        required={true}
        className="input-field"
      />
      {formData.antibiotics.map((antibiotic, index: number) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 my-6">
          <h4 className="text-lg font-semibold mb-4 text-primary">
            Antibiotic {index + 1}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stage */}
            <DropdownBox
              label='Stage'
              id={`stage_${index}`}
              name="abop_stage"
              value={antibiotic.abop_stage}
              options={[
                // { value: '', label: 'Select Stage' },
                { value: 'prior', label: 'PRIOR to Operation' },
                { value: 'pre_peri', label: 'PRE/PERI Operatively' },
                { value: 'after', label: 'AFTER PeriOperatively' },
              ]}
              required={true}
              className="input-field"
              onChange={(e) =>
                handleAntibioticChange(index, 'abop_stage', e.target.value)
              }
            />

            {/* Antibiotic Name */}
            <InputBox
              label="Antibiotic Name"
              type="text"
              id={`antibiotic_${index}`}
              name="antibiotic"
              className="input-field"
              required={true}
              value={antibiotic.antibiotic}
              onChange={(e) =>
                handleAntibioticChange(index, 'antibiotic', e.target.value)
              }
            />

            {/* Route of Administration */}
            <DropdownBox
              label="Route of Administration"
              id={`route_${index}`}
              name="route"
              className="input-field"
              value={antibiotic.route}
              options={[
                // { value: '', label: 'Select Route' },
                { value: 'IV', label: 'IV' },
                { value: 'Oral', label: 'Oral' },
                { value: 'IM', label: 'IM' },
              ]}
              required={true}
              onChange={(e) =>
                handleAntibioticChange(index, 'route', e.target.value)
              }
            />

            {/* Duration (mins) */}
            <InputBox
              label="Duration (mins)"
              type="number"
              className="input-field"
              id={`duration_${index}`}
              name="duration"
              value={antibiotic.duration}
              required={true}
              onChange={(e) =>
                handleAntibioticChange(index, 'duration', e.target.value)
              }
              nonnegative={true}
            />

            {/* No. of Doses */}
            <InputBox
              label="No. of Doses"
              type="number"
              id={`doses_${index}`}
              className="input-field"
              name="doses"
              value={antibiotic.doses}
              required={true}
              onChange={(e) =>
                handleAntibioticChange(index, 'doses', e.target.value)
              }
              nonnegative={true}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={removeAntibiotic}
          className="btn-secondary"
        >
          Remove Antibiotic
        </button>
        <button type="button" onClick={addAntibiotic} className="btn-primary">
          Add Antibiotic
        </button>
      </div>

      {/* Timing Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Time of Induction */}
        <DateTimePickerBox
          label="Time of Induction"
          id="timeOfInduction"
          className="input-field"
          name="timeOfInduction"
          value={formData.timeOfInduction}
          required={true}
          onChange={handleChange}
          type="time"
        />

        {/* Time of Incision */}
        <DateTimePickerBox
          label="Time of Incision"
          id="timeOfSkinIncision"
          name="timeOfSkinIncision"
          className="input-field"
          value={formData.timeOfSkinIncision}
          required={true}
          onChange={handleChange}
          type="time"
        />

        {/* End Time of Surgery */}
        <DateTimePickerBox
          label="End Time of Surgery"
          id="timeOfEndSurgery"
          className="input-field"
          name="timeOfEndSurgery"
          value={formData.timeOfEndSurgery}
          required={true}
          onChange={handleChange}
          type="time"
        />
      </div>
    </div>
  );
};

export default AntibioticPrescription;