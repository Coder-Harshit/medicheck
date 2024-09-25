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
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    console.log('Form Submitted:', formData);
    e.preventDefault();
    // Handle form submission (e.g., send data to API)
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Surgical Site Infection Surveillance Form</h2>
      <form onSubmit={handleSubmit}>
        <PatientData
          formData={formData}
          handleChange={handleChange}
        />


        <MicrobiologyData
          formData={formData}
          handleChange={handleChange}
        />

        {/*

        <AntibioticPrescription
          formData={formData}
          handleAntibioticChange={handleAntibioticChange}
          addAntibiotic={addAntibiotic}
          removeAntibiotic={removeAntibiotic}
        />
        <OperationTimings
          formData={formData}
          handleChange={handleChange}
        /> */}
        <button type="submit" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SSISurveillanceForm;
