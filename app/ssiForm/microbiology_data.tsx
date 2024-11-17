import React from 'react';
import { FormData } from './page';
import DropdownBox from '../../components/DropdownBox';

interface MicrobiologyDataProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleIsolateChange: (
    isolate: 'isolate1' | 'isolate2',
    category: 'sensitive' | 'resistant' | 'intermediate',
    value: string
  ) => void;
  isEditing?: boolean;
}


const antibioticOptions = [
  { label: 'Antibiotic 1', value: 'antibiotic1' },
  { label: 'Antibiotic 2', value: 'antibiotic2' },
  { label: 'Antibiotic 3', value: 'antibiotic3' },
  { label: 'Antibiotic 4', value: 'antibiotic4' },
  { label: 'Antibiotic 5', value: 'antibiotic5' },
  { label: 'Antibiotic 6', value: 'antibiotic6' },
  // Add more antibiotics as needed
];


const microorganisms = [
  { label: 'Bacteria', value: 'bacteria' },
  { label: 'Virus', value: 'virus' },
  { label: 'Fungi', value: 'fungi' },
  // Add more microorganisms as needed
];

// Component for Microbiology Data section
const MicrobiologyData: React.FC<MicrobiologyDataProps> = ({
  formData,
  handleChange,
  handleIsolateChange,
  isEditing,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-primary">Microbiology Data</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Micro-organisms Implicated in SSI */}
        <div className="md:col-span-2">
          <label
            htmlFor="microorganisms"
            className="block text-sm font-medium text-gray-700"
            title="Micro-organisms Implicated in SSI"
          >
            Micro-organisms Implicated in SSI
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DropdownBox
              id="microorganism1"
              name="microorganism1"
              // value={formData.microorganisms[0] || ''}
              value={formData.microorganism1 || ''}
              options={microorganisms}
              onChange={handleChange}
              className='input-field'
              required={true}
              isDisabled={isEditing}
            />
            <DropdownBox
              id="microorganism2"
              name="microorganism2"
              // value={formData.microorganisms[1] || ''}
              value={formData.microorganism2 || ''}
              options={microorganisms}
              onChange={handleChange}
              required={true}
              isDisabled={isEditing}
              className='input-field'
            />
          </div>
        </div>

        {/* Isolate 1 Antibiotic Susceptibility Pattern */}
        <div className="md:col-span-2">
          <h4 className="text-lg font-semibold mt-4 mb-2 text-primary">
            Isolate-1 (Antibiotic Susceptibility Pattern)
          </h4>
          <IsolateForm
            isolate="isolate1"
            formData={formData.isolate1}
            handleIsolateChange={handleIsolateChange}
            isEditing={isEditing}
          />
        </div>

        {/* Isolate 2 Antibiotic Susceptibility Pattern */}
        <div className="md:col-span-2">
          <h4 className="text-lg font-semibold mt-4 mb-2 text-primary">
            Isolate-2 (Antibiotic Susceptibility Pattern)
          </h4>
          <IsolateForm
            isolate="isolate2"
            formData={formData.isolate2}
            handleIsolateChange={handleIsolateChange}
            isEditing={isEditing}
          />
        </div>
      </div>
    </div>
  );
};

// Component for each Isolate form section
interface IsolateFormProps {
  isolate: 'isolate1' | 'isolate2';
  formData: { sensitive: string; resistant: string; intermediate: string };
  handleIsolateChange: (
    isolate: 'isolate1' | 'isolate2',
    category: 'sensitive' | 'resistant' | 'intermediate',
    value: string
  ) => void;
  isEditing?: boolean;
}

const IsolateForm: React.FC<IsolateFormProps> = ({
  isolate,
  formData,
  handleIsolateChange,
  isEditing,
}) => {
  const handleSelectChange = (
    category: 'sensitive' | 'resistant' | 'intermediate',
    value: string
  ) => {
    handleIsolateChange(isolate, category, value);
  };

  // Helper function to determine if an antibiotic is already selected in other categories
  const isOptionDisabled = (option: string, currentCategory: string) => {
    return (
      (formData.sensitive === option && currentCategory !== 'sensitive') ||
      (formData.resistant === option && currentCategory !== 'resistant') ||
      (formData.intermediate === option && currentCategory !== 'intermediate')
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sensitive */}
      <div>
        <DropdownBox
          label="Sensitive"
          id={`${isolate}_sensitive`}
          name={`${isolate}_sensitive`}
          value={formData.sensitive}
          options={[
            // { value: '', label: 'Select' },
            ...antibioticOptions.map((option) => ({
              ...option,
              disabled: isOptionDisabled(option.value, 'sensitive'),
            })),
          ]}
          onChange={(e) => handleSelectChange('sensitive', e.target.value)}
          required={true}
          className='input-field'
          isDisabled={isEditing}
        />
      </div>
      {/* Resistant */}
      <div>
        <DropdownBox
          label="Resistant"
          id={`${isolate}_resistant`}
          name={`${isolate}_resistant`}
          value={formData.resistant}
          options={[
            // { value: '', label: 'Select' },
            ...antibioticOptions.map((option) => ({
              ...option,
              disabled: isOptionDisabled(option.value, 'resistant'),
            })),
          ]}
          onChange={(e) => handleSelectChange('resistant', e.target.value)}
          required={true}
          isDisabled={isEditing}
          className='input-field'
        />
      </div>
      {/* Intermediate */}
      <div>
        <DropdownBox
          label="Intermediate"
          id={`${isolate}_intermediate`}
          name={`${isolate}_intermediate`}
          value={formData.intermediate}
          options={[
            // { value: '', label: 'Select' },
            ...antibioticOptions.map((option) => ({
              ...option,
              disabled: isOptionDisabled(option.value, 'intermediate'),
            })),
          ]}
          onChange={(e) => handleSelectChange('intermediate', e.target.value)}
          required={true}
          className='input-field'
          isDisabled={isEditing}
        />
      </div>
    </div>
  );
};

export default MicrobiologyData;