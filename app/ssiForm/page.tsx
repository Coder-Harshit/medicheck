'use client';

import React, { useState } from 'react';
import PatientData from './patient_data';
import MicrobiologyData from './microbiology_data';
import AntibioticPrescription from './antibiotic_prescription';
import OperationTimings from './operation_timings';
import './style.css';

interface Antibiotic {
  antibiotic: string;
  route: string;
  duration: number;
  doses: number;
}

export interface FormData {
  patientName: string;
  patientId: string;
  age: number;
  gender: 'M' | 'F';
  dateOfAdmission: string;
  dateOfProcedure: string;
  admittingDepartment: string;
  departmentPrimarySurgeon: string;
  primarySurgeonName: string;
  procedureName: string;
  diagnosis: string;
  otno: number;
  procedureDoneBy: string;
  outpatientProcedure: boolean;
  scenarioOfProcedure: 'Elective' | 'Emergency';
  woundClass: 'Clean' | 'Clean Contaminated' | 'Contaminated' | 'Dirty/Infected';
  papGiven: boolean;
  papDuration: string;
  antibioticsGiven: string;
  ssiEventOccurred: boolean;
  dateOfSSIEvent: string;
  eventDetails: string;
  detected: 'A' | 'P' | 'RF';
  microorganisms: string[];
  secondaryBSI: boolean;
  antibiotics: Antibiotic[];
  timeOfInduction: string;
  timeOfSkinIncision: string;
  timeOfEndSurgery: string;
  isolate1: {
    sensitive: string;
    resistant: string;
    intermediate: string;
  };
  isolate2: {
    sensitive: string;
    resistant: string;
    intermediate: string;
  };
}

const SSISurveillanceForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    patientId: '',
    age: 0,
    gender: 'M',
    dateOfAdmission: '',
    dateOfProcedure: '',
    admittingDepartment: '',
    departmentPrimarySurgeon: '',
    primarySurgeonName: '',
    procedureName: '',
    diagnosis: '',
    otno: 1,
    procedureDoneBy: '',
    outpatientProcedure: true,
    scenarioOfProcedure: 'Elective',
    woundClass: 'Clean',
    papGiven: true,
    antibioticsGiven: '',
    papDuration: '',
    ssiEventOccurred: true,
    dateOfSSIEvent: '',
    eventDetails: '',
    detected: 'A',
    microorganisms: [],
    secondaryBSI: false,
    antibiotics: [{ antibiotic: '', route: '', duration: 0, doses: 0 }],
    timeOfInduction: '',
    timeOfSkinIncision: '',
    timeOfEndSurgery: '',
    isolate1: {
      sensitive: '',
      resistant: '',
      intermediate: '',
    },
    isolate2: {
      sensitive: '',
      resistant: '',
      intermediate: '',
    },
  });

  const [currentStep, setCurrentStep] = useState(0);


  // Generalized handler for both input and dropdown changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log('Event:', e.target);
    // const { name, value, type } = e.target as HTMLInputElement;
    const { name, value, type } = e.target;

    // Handle input and select elements consistently
    let updatedValue: string | boolean | Date | string[];
    if (name === 'papGiven' || name === 'outpatientProcedure' || name === 'ssiEventOccurred' || name === 'secondaryBSI') {
      updatedValue = value === 'Yes';
    }
    else if (type === 'date') {
      updatedValue = new Date(value);
    } else if (name === 'microorganism1' || name === 'microorganism2') {
      console.log('Microorganisms:', name, value);
      const index = name === 'microorganism1' ? 0 : 1;
      const updatedMicroorganisms = [...formData.microorganisms];
      updatedMicroorganisms[index] = value;
      updatedValue = updatedMicroorganisms;
      setFormData({ ...formData, microorganisms: updatedMicroorganisms });
    } else {
      updatedValue = value;
    }

    // Update state using spread syntax and dynamic property access
    setFormData({
      ...formData,
      [name === 'microorganism1' || name === 'microorganism2' ? 'microorganisms' : name]: updatedValue,
    });
  };
  // Handler for updating antibiotics array
  const handleAntibioticChange = (index: number, name: string, value: string | number) => {
    const updatedAntibiotics = formData.antibiotics.map((antibiotic, i) =>
      i === index ? { ...antibiotic, [name]: value } : antibiotic
    );
    setFormData({ ...formData, antibiotics: updatedAntibiotics });
  };

  const handleIsolateChange = (isolate: 'isolate1' | 'isolate2', category: 'sensitive' | 'resistant' | 'intermediate', value: string) => {
    const updatedIsolate = { ...formData[isolate], [category]: value };
    setFormData({ ...formData, [isolate]: updatedIsolate });
  }

  // Add new antibiotic
  const addAntibiotic = () => {
    setFormData({
      ...formData,
      antibiotics: [...formData.antibiotics, { antibiotic: '', route: '', duration: 0, doses: 0 }],
    });
  };

  // Remove last antibiotic (ensure at least one remains)
  const removeAntibiotic = () => {
    if (formData.antibiotics.length > 1) {
      const newAntibiotics = formData.antibiotics.slice(0, -1);
      setFormData({ ...formData, antibiotics: newAntibiotics });
    }
  };

  const steps = [
    {
      id: 0, title: 'Patient Data', component:
        <PatientData
          formData={formData}
          handleChange={handleChange}
        />
    },
    {
      id: 1, title: 'Microbiology Data', component:
        <MicrobiologyData
          formData={formData}
          handleChange={handleChange}
          handleIsolateChange={handleIsolateChange}
        />
    },
    {
      id: 2, title: 'Antibiotic Prescription', component:
        <AntibioticPrescription
          formData={formData}
          handleAntibioticChange={handleAntibioticChange}
          addAntibiotic={addAntibiotic}
          removeAntibiotic={removeAntibiotic}
        />
    },
    // {
    //   id: 3, title: 'Operation Timings', component:
    //     <OperationTimings
    //       formData={formData}
    //       handleChange={handleChange}
    //     />
    // },
  ]

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Handle form submission (e.g., send data to API)
  };


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-bold mb-6 text-center">Surgical Site Infection Surveillance Form</h2>


      {/* Step Indicator */}
      <div className="flex justify-center mb-6">
        {steps.map((step, index) => (
          <div key={step.id}
            // className={`mx-2 py-1 px-4 ${index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
            className={`mx-2 py-2 px-4 ${index === currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
          >
            {step.title}
          </div>
        ))}
      </div>

      <form>
        {/* Render current step component */}
        {steps[currentStep].component}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className={`px-4 py-2 bg-gray-500 text-white rounded ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              className="bg-indigo-500 text-white hover:bg-indigo-600 w-max
              px-4 py-2 rounded"
              onClick={handleNextStep}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SSISurveillanceForm;
