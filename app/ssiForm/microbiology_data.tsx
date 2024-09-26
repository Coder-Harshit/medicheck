import React, { useState } from 'react';
import { FormData } from './page';
import DropdownBox from '../components/DropdownBox';

interface MicrobiologyDataProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleIsolateChange: (
    isolate: 'isolate1' | 'isolate2',
    category: 'sensitive' | 'resistant' | 'intermediate',
    value: string
  ) => void;
}


// Antibiotics options list
const antibioticOptions = [
  { label: 'Antibiotic 1', value: 'antibiotic1' },
  { label: 'Antibiotic 2', value: 'antibiotic2' },
  { label: 'Antibiotic 3', value: 'antibiotic3' },
  // Add more antibiotics as needed
];


const microorganisms = [
  { label: '----', value: '' },
  { label: 'Bacteria', value: 'bacteria' },
  { label: 'Virus', value: 'virus' },
  // Add more microorganisms as needed
];



const MicrobiologyData: React.FC<MicrobiologyDataProps> = ({ formData, handleChange, handleIsolateChange }) => {

  return (
    <div className="container mx-auto p-4 rounded-lg section_box">
      <h3 className="text-2xl font-bold mt-4 mb-6 text-center">Microbiology Data</h3>
      <div className="grid grid-cols-3 md:grid-cols-1 gap-10">
        <div className="flex flex-row">
          <label className="font-semibold self-center mx-3 px-3 basis-2/3">
            Micro-organisms Implicated in SSI
          </label>
          <DropdownBox
            id="microorganism1"
            name="microorganism1"
            value={formData.microorganisms[0] || ''}
            options={microorganisms}
            onChange={handleChange}
            className="select text-black py-3 px-6 mx-6 rounded-md w-full"
          />
          <DropdownBox
            id="microorganism2"
            name="microorganism2"
            value={formData.microorganisms[1] || ''}
            options={microorganisms}
            onChange={handleChange}
            className="select text-black py-3 px-6 mx-6 rounded-md w-full"
          />
        </div>

        {/* Isolate 1 and Isolate 2 Antibiotic Susceptibility Pattern */}
        <div className="grid grid-cols-2 gap-8">
          <IsolateForm
            label="Isolate-1 (Antibiotic Susceptibility Pattern)"
            isolate="isolate1"
            formData={formData.isolate1}
            handleIsolateChange={handleIsolateChange}
          />
          <IsolateForm
            label="Isolate-2 (Antibiotic Susceptibility Pattern)"
            isolate="isolate2"
            formData={formData.isolate2}
            handleIsolateChange={handleIsolateChange}
          />
        </div>
      </div>
    </div>
  );
};

// Component for each Isolate form section
interface IsolateFormProps {
  label: string;
  isolate: 'isolate1' | 'isolate2';
  formData: { sensitive: string; resistant: string; intermediate: string };
  handleIsolateChange: (
    isolate: 'isolate1' | 'isolate2',
    category: 'sensitive' | 'resistant' | 'intermediate',
    value: string
  ) => void;
}

const IsolateForm: React.FC<IsolateFormProps> = ({ label, isolate, formData, handleIsolateChange }) => {
  const handleSelectChange = (category: 'sensitive' | 'resistant' | 'intermediate', value: string) => {
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
    <div>
      <label className="block text-sm font-semibold mb-2 text-white">{label}</label>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-300 mb-2">Sensitive</label>
          <select
            value={formData.sensitive}
            onChange={(e) => handleSelectChange('sensitive', e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="">Select</option>
            {antibioticOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={isOptionDisabled(option.value, 'sensitive')}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-2">Resistant</label>
          <select
            value={formData.resistant}
            onChange={(e) => handleSelectChange('resistant', e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="">Select</option>
            {antibioticOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={isOptionDisabled(option.value, 'resistant')}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-2">Intermediate</label>
          <select
            value={formData.intermediate}
            onChange={(e) => handleSelectChange('intermediate', e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="">Select</option>
            {antibioticOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={isOptionDisabled(option.value, 'intermediate')}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MicrobiologyData;
